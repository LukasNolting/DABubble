import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessagesService } from '../../../shared/services/messages.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
  @Input() builder!: string;
  @Output() threadChatToggle = new EventEmitter<void>()
  showDisplay = 'display:block';
  activeUserId: string = '3';
  messages: any[] = []; // Nachrichten
  threadMessages: any[] = []; // Thread-Nachrichten
  activeMessageId: string | null = null; // Aktive Nachricht, für die Threads geladen werden
  activeUserPhotoURL: string | null = null; 

  constructor(
    private messagesService: MessagesService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.activeUserPhotoURL = this.authService.currentUser()?.photoURL || null;
    console.log('ChatboxComponent: activeUserPhotoURL:', this.activeUserPhotoURL);
    // Nachrichten abonnieren
    this.messagesService.messages$.subscribe((messages) => {
      this.messages = messages;
      console.log('Nachrichten aktualisiert:', this.messages);
    });
  }

  onMessageSelect(messageId: string): void {
    this.activeMessageId = messageId;
    this.messagesService.loadThreadMessages(messageId); // Lädt Threads und öffnet den Threadchat
  }
}
