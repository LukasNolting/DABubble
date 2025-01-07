import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { ChannelsService } from '../../../shared/services/channels.service';
import { MessagesService } from '../../../shared/services/messages.service';
import { Subscription } from 'rxjs';
import { Message, ThreadMessage } from '../../../models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { UserModel } from '../../../models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { EmojiPickerService } from '../../../shared/services/emoji-picker.service';

@Component({
  selector: 'app-messagebox',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiPickerComponent],
  templateUrl: './messagebox.component.html',
  styleUrls: ['./messagebox.component.scss'], // Korrektur: "styleUrl" zu "styleUrls"
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MessageboxComponent implements OnInit, OnDestroy {
  @Input() builder!: string;
  channelId: string | undefined;
  messageId: string | undefined;
  activeChannelName: string | null = null;
  messageContent: string = '';
  private subscriptions: Subscription = new Subscription();
  activeUserId: string | null = null;
  isMessageBoxMainPickerOpen = false;
  isMessageBoxThreadPickerOpen = false;

  constructor(
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private authService: AuthService,
    public emojiPickerService: EmojiPickerService
  ) {}

  ngOnInit(): void {
    this.activeUserId = this.authService.userId();
    if (this.builder === 'mainchat') {
      // Beobachtet den aktuellen Channel
      const channelSubscription =
        this.channelsService.currentChannel$.subscribe((channel) => {
          if (channel) {
            this.channelId = channel.id;
            this.activeChannelName = channel.name;
            console.log('Aktueller Channel-Name:', this.activeChannelName);
          } else {
            console.log('Kein aktiver Channel ausgewählt.');
          }
        });
      this.subscriptions.add(channelSubscription);
    } else if (this.builder === 'threadchat') {
      // Beobachtet die Message-ID für den Threadchat
      const threadSubscription = this.messagesService.messageId$.subscribe(
        (messageId) => {
          if (messageId) {
            this.messageId = messageId;
            console.log('Threadchat aktiv, Message-ID:', messageId);
          } else {
            // console.log('Keine gültige Message-ID für den Threadchat gefunden.');
          }
        }
      );
      this.subscriptions.add(threadSubscription);
    }

    const emojiPickerMainSubscription =
      this.emojiPickerService.isMessageBoxMainPickerOpen$.subscribe((open) => {
        this.isMessageBoxMainPickerOpen = open;
      });
    const emojiPickerThreadSubscription =
      this.emojiPickerService.isMessageBoxThreadPickerOpen$.subscribe(
        (open) => {
          this.isMessageBoxThreadPickerOpen = open;
        }
      );
    this.subscriptions.add(emojiPickerMainSubscription);
    this.subscriptions.add(emojiPickerThreadSubscription);
  }

  ngOnDestroy(): void {
    // Alle Subscriptions aufräumen
    this.subscriptions.unsubscribe();
  }

  async sendMessage(): Promise<void> {
    if (!this.messageContent.trim()) {
      console.error('Nachricht darf nicht leer sein.');
      return;
    }

    let user: UserModel = (await this.authService.getUserById(
      this.activeUserId
    )) as UserModel;

    // Erstelle ein Message-Objekt
    const message: Message = {
      channelId: this.channelId || '',
      createdBy: this.activeUserId || '',
      creatorName: user.name || '',
      creatorPhotoURL: user.photoURL || '',
      message: this.messageContent.trim(),
      timestamp: new Date(),
      isPrivate: false,
      members: [],
      reactions: [],
    };

    // Sende die Nachricht über den Service
    if (this.channelId) {
      try {
        await this.messagesService.addMessage(message);
        console.log('Nachricht erfolgreich gesendet:', message);
        this.messageContent = '';
      } catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
      }
    } else {
      console.error('Keine gültige Channel-ID verfügbar.');
    }
  }

  /**
   * Sende eine neue Thread-Nachricht.
   */
  async sendThreadMessage(): Promise<void> {
    if (!this.messageContent.trim()) {
      console.error('Nachricht darf nicht leer sein.');
      return;
    }
    let user: UserModel = (await this.authService.getUserById(
      this.activeUserId
    )) as unknown as UserModel;
    console.log('User:', user);
    // Erstelle ein ThreadMessage-Objekt
    const threadMessage: ThreadMessage = {
      createdBy: this.activeUserId || '',
      creatorName: user.name || '',
      creatorPhotoURL: user.photoURL || '',
      message: this.messageContent.trim(),
      timestamp: new Date(),
      reactions: [],
    };

    // Sende die Nachricht über den Service
    if (this.messageId) {
      this.messagesService
        .addThreadMessage(this.messageId, threadMessage)
        .then(() => {
          console.log('Thread-Nachricht erfolgreich gesendet:', threadMessage);
          this.messageContent = '';
        })
        .catch((error) => {
          console.error('Fehler beim Senden der Thread-Nachricht:', error);
        });
    } else {
      console.error('Keine gültige Message-ID für den Thread verfügbar.');
    }
  }

  // toggleEmojiPicker() {
  //   if (this.isMessageBoxMainPickerOpen || this.isMessageBoxThreadPickerOpen) {
  //     this.emojiPickerService.closeMsgBoxEmojiPicker();
  //   } else {
  //     if (this.builder === 'mainchat') {
  //       this.emojiPickerService.openMsgBoxEmojiPickerMain();
  //     } else if (this.builder === 'threadchat') {
  //       this.emojiPickerService.openMsgBoxEmojiPickerThread();
  //     }
  //   }
  // }

  toggleEmojiPickerMain(){
    if(!this.isMessageBoxMainPickerOpen && !this.isMessageBoxThreadPickerOpen){
      this.emojiPickerService.openMsgBoxEmojiPickerMain();
    }else if(this.isMessageBoxMainPickerOpen){
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
    }else if(this.isMessageBoxThreadPickerOpen){
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
      this.emojiPickerService.openMsgBoxEmojiPickerMain();
    }
  }

  toggleEmojiPickerThread(){
    if(!this.isMessageBoxMainPickerOpen && !this.isMessageBoxThreadPickerOpen){
      this.emojiPickerService.openMsgBoxEmojiPickerThread();
    } else if(this.isMessageBoxThreadPickerOpen){
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
    } else if(this.isMessageBoxMainPickerOpen){
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
      this.emojiPickerService.openMsgBoxEmojiPickerThread();
    }
  }

  preventMsgBoxEmojiPickerClose(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeEmojiPicker(event: Event): void {
    if (this.isMessageBoxMainPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
    } else if(this.isMessageBoxThreadPickerOpen){
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
    }
  }

  addEmoji(emoji: string) {
    this.messageContent += emoji;
  }

  checkKeyStatus(event: KeyboardEvent, chat: string): void {
    if (event.shiftKey && event.keyCode == 13) {
      event.preventDefault();
    } else if (event.keyCode == 13) {
      if (chat === 'mainchat') {
        this.sendMessage();
      } else if (chat === 'threadchat') {
        this.sendThreadMessage();
      }
    }
  }
}
