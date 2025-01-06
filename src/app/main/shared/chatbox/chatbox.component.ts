import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { MessagesService } from '../../../shared/services/messages.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Message, Reaction, ThreadMessage } from '../../../models/message';
import { Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Channel } from '../../../models/channel';
import { ChannelsService } from '../../../shared/services/channels.service';
import { EditmessageComponent } from '../editmessage/editmessage.component';
import { MatDialog } from '@angular/material/dialog';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatboxComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() builder!: string;
  @Output() threadChatToggle = new EventEmitter<void>();
  currentChannel$: Observable<Channel | null>;
  messages$: Observable<Partial<Message>[]>;
  avatars$!: Observable<Map<string, string>>;
  threadMessages$: Observable<ThreadMessage[]>;
  activeUserId: string | null = null;
  activeMessageId: string | null = null;
  loadingMessages: WritableSignal<boolean> = signal(true);
  private destroy$ = new Subject<void>();
  loadingAvatars: boolean = false;
  emojiPickerOpened: boolean = false;
  emojiPickerOpenedFor: string | null = null;
  selectedEmoji = '';

  constructor(
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.currentChannel$ = this.channelsService.currentChannel$;
    this.messages$ = this.messagesService.messages$;
    this.threadMessages$ = this.messagesService.threadMessages$;
    this.activeUserId = this.authService.userId();
  }

  ngOnInit(): void {
    this.channelsService.setDefaultChannel();
    if (this.builder === 'mainchat') {
      this.initMainChat();
    } else if (this.builder === 'threadchat') {
      this.initThreadChat();
    }
  }

  ngAfterViewInit(): void {
    const chatboxSelector =
      this.builder === 'mainchat' ? 'mainchat__chatbox' : 'threadchat__chatbox';
    const observer = new MutationObserver(() => {
      const chatbox = document.querySelector(chatboxSelector) as HTMLElement;
      if (chatbox) {
        chatbox.scrollTop = chatbox.scrollHeight;
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  scrollToBottom(selector: string): void {
    const chatbox = document.querySelector(selector) as HTMLElement;
    if (chatbox) {
      setTimeout(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
      }, 0);
    }
  }

  checkForScrollbar(selector: string): void {
    const chatbox = document.querySelector(selector) as HTMLElement;
    if (chatbox.scrollHeight > chatbox.clientHeight) {
      chatbox.classList.add('has-scroll');
      this.scrollToBottom(selector);
    } else {
      chatbox.classList.remove('has-scroll');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMainChat(): void {
    this.currentChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((channel) => this.handleMainChatChannel(channel));
    this.avatars$ = this.messagesService.avatars$;
  }

  private initThreadChat(): void {
    this.messagesService.messageId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((messageId) => this.handleThreadChatMessage(messageId));
    this.avatars$ = this.messagesService.avatars$;
  }

  private async handleMainChatChannel(channel: Channel | null): Promise<void> {
    if (channel) {
      this.loadingMessages.set(true);
      try {
        this.messages$ = this.messagesService
          .loadMessagesForChannel(channel.id || '')
          .pipe(
            tap(() => {
              setTimeout(() => {
                this.scrollToBottom(
                  this.builder === 'mainchat'
                    ? '.mainchat__chatbox'
                    : '.threadchat__chatbox'
                );
              }, 0);
              this.loadingAvatars = true;
            }),
            map((messages) =>
              messages.sort((a, b) => {
                const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return dateA - dateB;
              })
            ),
            tap(() => {
              this.loadingAvatars = false;
            }),
            catchError((error) => {
              console.error(
                'Fehler beim Laden und Sortieren der Nachrichten:',
                error
              );
              this.loadingAvatars = false;
              return [];
            })
          );
      } catch (error) {
        console.error('Fehler beim Laden der Nachrichten:', error);
      } finally {
        this.loadingMessages.set(false);
      }
    }
  }

  private handleThreadChatMessage(messageId: string | null): void {
    this.activeMessageId = messageId;
    if (messageId) {
      this.loadingMessages.set(true);
      try {
        this.messagesService.loadThreadMessages(messageId);
        this.activeMessageId = messageId;
      } catch (error) {
        console.error('Fehler beim Laden der Thread-Nachrichten:', error);
      } finally {
        this.loadingMessages.set(false);
        setTimeout(() => {
          this.scrollToBottom('.threadchat__chatbox');
        }, 200);
      }
    } else {
      console.log('Keine gültige Message-ID für Thread gefunden.');
    }
  }

  onMessageSelect(messageId: string): void {
    this.activeMessageId = messageId;
    this.messagesService.setMessageId(messageId);
    this.messagesService.loadThreadMessages(messageId);
  }

  trackByMessageId(index: number, message: Message): string {
    return message.docId || index.toString();
  }

  editMessage(message: Partial<Message>, deleteMessage: boolean) {
    this.dialog.open(EditmessageComponent, {
      width: 'fit-content',
      maxWidth: '100vw',
      height: 'fit-content',
      data: { message, deleteMessage },
    });
  }

  editThreadMessage(
    message: Partial<ThreadMessage>,
    deleteMessage: boolean,
    parentMessageId: string,
    docId: string | undefined
  ) {
    this.dialog.open(EditmessageComponent, {
      width: 'fit-content',
      maxWidth: '100vw',
      height: 'fit-content',
      data: { message, deleteMessage, thread: true, parentMessageId, docId },
    });
  }

  onEmojiSelected(emoji: string) {
    this.selectedEmoji = emoji;
  }

  toggleEmojiPicker(messageId: string) {
    this.emojiPickerOpened = !this.emojiPickerOpened;
    if (this.emojiPickerOpened) {
      this.emojiPickerOpenedFor = messageId;
    } else {
      this.emojiPickerOpenedFor = null;
    }
  }

  preventEmojiPickerClose(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.emojiPickerOpened) {
      this.emojiPickerOpened = false;
      this.emojiPickerOpenedFor = null;
    }
  }

  addEmoji(
    messageIdOrThreadDocId: string,
    userId: string,
    emoji: string,
    isThreadMessage: boolean
  ): void {
    this.selectedEmoji = emoji;

    const reaction: Reaction = { emoji, userId };
    const updateData: Partial<Message> = {
      reactions: [reaction],
    };

    // Determine whether to update a thread message or a regular message
    const updatePromise = isThreadMessage
      ? this.messagesService.updateThreadMessage(
          this.activeMessageId!,
          messageIdOrThreadDocId,
          userId,
          updateData
        )
      : this.messagesService.updateMessage(
          messageIdOrThreadDocId,
          userId,
          updateData
        );

    updatePromise
      .then(() => {
        console.log(
          `Reaction added to ${
            isThreadMessage ? 'thread message' : 'message'
          } ${this.activeMessageId}`
        );
      })
      .catch((error) => {
        console.error('Error adding reaction:', error);
      });

    this.emojiPickerOpened = false;
  }
}
