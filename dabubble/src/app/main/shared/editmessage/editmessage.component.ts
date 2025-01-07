import { Component,Inject  } from '@angular/core';
import { MessagesService } from '../../../shared/services/messages.service';
import { Message, ThreadMessage } from '../../../models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-editmessage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editmessage.component.html',
  styleUrl: './editmessage.component.scss'
})
export class EditmessageComponent {
  messageForm: FormGroup;
  messageDelete: boolean;
  isThread: boolean;

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<EditmessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      message: Partial<Message>; 
      deleteMessage: boolean; 
      thread: boolean; 
      parentMessageId?: string; 
      docId?: string 
    }
  ) {
    this.isThread = this.data.thread; // Prüfen, ob es sich um eine Thread-Nachricht handelt
    this.messageDelete = this.data.deleteMessage;
  
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
      reactions: [''],
    });
  
    if (this.isThread && !this.data.parentMessageId) {
      console.error('parentMessageId fehlt für Thread-Nachricht');
    }
  }


    ngOnInit(): void {
      this.messageForm.setValue({
        message: this.data.message.message || '',
        reactions: this.data.message.reactions || [],
      });
    }


    /**
   * Verarbeitet das Absenden des Formulars für Nachrichten oder Thread-Nachrichten.
   */
    onSubmit(): void {
      if (this.messageForm.valid && this.checkCreatorWithActiveUser()) {
        const updatedData = {
          ...this.data.message,
          ...this.messageForm.value,
        };
    
        if (this.isThread) {
          if (!this.data.parentMessageId) {
            console.error('Fehlende parentMessageId für Thread-Nachricht');
            return;
          }
          // Thread-Nachricht aktualisieren
          this.messagesService.updateThreadMessage(
            this.data.parentMessageId,
            this.data.docId!, // docId sollte für Thread-Nachrichten vorhanden sein
            this.auth.userId()!,
            updatedData
          )
            .then(() => {
              console.log('Thread-Nachricht erfolgreich aktualisiert:', updatedData);
              this.dialogRef.close();
            })
            .catch((error) => {
              console.error('Fehler beim Aktualisieren der Thread-Nachricht:', error);
            });
        } else {
          // Normale Nachricht aktualisieren
          this.messagesService.updateMessage(updatedData.docId, updatedData.createdBy, updatedData)
            .then(() => {
              console.log('Nachricht erfolgreich aktualisiert:', updatedData);
              this.messageForm.reset();
              this.dialogRef.close();
            })
            .catch((error) => {
              console.error('Fehler beim Aktualisieren der Nachricht:', error);
            });
        }
      } else if (!this.messageForm.valid) {
        console.log('Formular ist ungültig.');
      } else if (!this.checkCreatorWithActiveUser()) {
        console.log('Nur der Ersteller kann die Nachricht bearbeiten.');
      }
    }


  checkCreatorWithActiveUser(): boolean {
    const dataUser = this.data.message.createdBy;
    const activeUser = this.auth.userId();
    console.log('data user', dataUser);
    console.log('active user', activeUser);
  return dataUser === activeUser;  }


  deleteMessage(): void {
    if (!this.checkCreatorWithActiveUser()) {
      console.log('Nur der Ersteller kann die Nachricht löschen.');
      return;
    }
  
    const { docId, parentMessageId } = this.data;

    if (this.isThread) {
      if (!docId || !parentMessageId) {
        console.error('DocId oder ParentMessageId fehlt für das Löschen der Thread-Nachricht.');
        return;
      }
      this.messagesService.deleteMessage(docId, this.auth.userId()!, true, parentMessageId)
        .then(() => {
          console.log('Thread-Nachricht erfolgreich gelöscht.');
          this.dialogRef.close();
        })
        .catch((error) => {
          console.error('Fehler beim Löschen der Thread-Nachricht:', error);
        });
    } else {
      const deleteMessage = this.data.message.docId;
      if (!deleteMessage) {
        console.error('DocId fehlt für das Löschen der Nachricht.');
        return;
      }
      this.messagesService.deleteMessage(deleteMessage, this.auth.userId()!)
        .then(() => {
          console.log('Nachricht erfolgreich gelöscht.');
          this.dialogRef.close();
        })
        .catch((error) => {
          console.error('Fehler beim Löschen der Nachricht:', error);
        });
    }
  }



  onCancel(): void { 
    console.log('Edit cancelled');
    this.messageForm.reset();
    this.dialogRef.close(); 
  }
}
