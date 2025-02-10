import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChannelsService } from '../../../shared/services/channels.service';
import { MessagesService } from '../../../shared/services/messages.service';
import { UserService } from '../../../shared/services/user.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Message, ThreadMessage } from '../../../models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { UserModel } from '../../../models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../shared/services/newmessage.service';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { EmojiPickerService } from '../../../shared/services/emoji-picker.service';
import { Channel } from '../../../models/channel';
import { firstValueFrom } from 'rxjs';
import { MentionService } from '../../../shared/services/mention.service';
import { MentionComponent } from '../mention/mention.component';

@Component({
  selector: 'app-messagebox',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiPickerComponent, MentionComponent],
  templateUrl: './messagebox.component.html',
  styleUrls: ['./messagebox.component.scss'], // Korrektur: "styleUrl" zu "styleUrls"
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MessageboxComponent implements OnInit, OnDestroy {
  @ViewChild('mainMessageBox') mainMessageBox!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('threadMessageBox') threadMessageBox!: ElementRef<HTMLTextAreaElement>;
  
  @Input() builder!: string;
  channelId: string | undefined;
  messageId: string | undefined;
  activeChannelName: string | null = null;
  messageContent: string = '';
  private subscriptions: Subscription = new Subscription();
  activeUserId: string | null = null;
  isMessageBoxMainPickerOpen: boolean = false;
  isMessageBoxThreadPickerOpen: boolean = false;
  isMessageBoxCreateMessagePickerOpen: boolean = false;
  members: any = [];
  mentionPicker:boolean = false;

  constructor(
    private userService: UserService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private authService: AuthService,
    public emojiPickerService: EmojiPickerService,
    private sharedService: SharedService,
    public mentionService: MentionService,
  ) { }

  ngOnInit(): void {
    this.activeUserId = this.authService.userId();
    if (this.builder === 'mainchat') {
      const channelSubscription =
        this.channelsService.currentChannel$.subscribe((channel) => {
          if (channel) {
            this.channelId = channel.id;
            this.activeChannelName = channel.name;
          if (this.mainMessageBox) {
            setTimeout(() => this.mainMessageBox.nativeElement.focus(), 100);
          }
          }
        });
      this.subscriptions.add(channelSubscription);
    } else if (this.builder === 'threadchat') {
      const threadSubscription = this.messagesService.messageId$.subscribe(
        (messageId) => {
          if (messageId) {
            this.messageId = messageId;
            if (this.threadMessageBox) {
              setTimeout(() => this.threadMessageBox.nativeElement.focus(), 100);
            }
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
    const emojiPickerCreateMessageSubscription =
      this.emojiPickerService.isMessageBoxCreateMessagePickerOpen$.subscribe(
        (open) => {
          this.isMessageBoxCreateMessagePickerOpen = open;
        }
      );
    this.subscriptions.add(emojiPickerMainSubscription);
    this.subscriptions.add(emojiPickerThreadSubscription);
    this.subscriptions.add(emojiPickerCreateMessageSubscription);
  }

  ngOnDestroy(): void {
    // Alle Subscriptions aufräumen
    this.subscriptions.unsubscribe();
  }

  jumpToAtAbove() {
    console.log('you clicked (at)');
    //this.searchString = "@";
    this.sharedService.setSearchString('@');
  }

  // von christoph
  sendToId: string = '';


  async createNewChannel(sendToUserId: string) {
    let user1 = await firstValueFrom(this.userService.getuserName(this.activeUserId ?? ''));
    let user2 = await firstValueFrom(this.userService.getuserName(sendToUserId ?? ''));

    const newChannel: Channel = {
      name: `zwischen ${user1} und ${user2}`, // String korrekt zusammenfügen
      description: '',
      isPrivate: true,
      createdBy: this.activeUserId ?? '',
      members: [this.activeUserId ?? '', sendToUserId ?? ''],
    };

    await this.channelsService.createChannel(newChannel);
  }


  async createNewMessage(): Promise<void> {
    if (!this.messageContent.trim()) {
      console.error('Nachricht darf nicht leer sein.');
      return;
    }

    // searchText auswerten
    let sendToUserId = this.sharedService.getUserIdString();
    let sendToChannelId = this.sharedService.getChannelIdString();
    let sendToTarget = this.sharedService.getTargetString();

    console.log('dahin 1:', sendToTarget);

    if (sendToTarget == 'toUser') {

      this.sendToId = sendToUserId;

      // unklar ob das wichtig ist ...
      //this.members = [sendToUserId, this.activeUserId];
      //console.log('members:', this.members);

      // finde channel wo nur die zwei drin sind

      // Prüfe, ob ein privater Channel existiert
      const existingChannels = await this.channelsService.getPrivateChannelByMembers([this.activeUserId ?? '', sendToUserId]);
      console.log("test wegen privater channel: ", existingChannels);

      if (existingChannels.length > 0) {
        this.sendToId = existingChannels[0].id ?? '';
      } else {
        // // Erstelle einen neuen privaten Channel
        this.createNewChannel(sendToUserId);
        // let user1 = this.userService.getuserName(this.activeUserId ?? '')
        // let user2 = this.userService.getuserName(sendToUserId ?? '');
        // console.log("user2:", user2);

        // const newChannel: Channel = {
        //   name: `Privater Channel zwischen ${user1} und ${user2}`,
        //   description: '',
        //   isPrivate: true,
        //   createdBy: this.activeUserId ?? '',
        //   members: [this.activeUserId ?? '', sendToUserId ?? ''],
        // };
        // await this.channelsService.createChannel(newChannel);
      }
    } else if (sendToTarget == 'toChannel') {
      this.sendToId = sendToChannelId;
      //this.members = [];
    }

    console.log('dahin:', this.sendToId);

    // senden
    let user: UserModel = (await this.authService.getUserById(
      this.activeUserId
    )) as UserModel;

    // Erstelle ein Message-Objekt
    const message: Omit<Message, 'threadMessages$'> = {
      channelId: this.sendToId || '',
      createdBy: this.activeUserId || '',
      creatorName: user.name || '',
      creatorPhotoURL: user.photoURL || '',
      message: this.messageContent.trim(),
      timestamp: new Date(),
      members: this.members,
      reactions: [],
      sameDay: false,
    };

    // Sende die Nachricht über den Service
    if (1 == 1) {
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

    // ansicht: direkt da hin wechseln!
    await this.channelsService.selectChannel(this.sendToId);

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
    const message: Omit<Message, 'threadMessages$'> = {
      channelId: this.channelId || '',
      createdBy: this.activeUserId || '',
      creatorName: user.name || '',
      creatorPhotoURL: user.photoURL || '',
      message: this.messageContent.trim(),
      timestamp: new Date(),
      members: [],
      reactions: [],
      sameDay: false
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
    // Erstelle ein ThreadMessage-Objekt
    const threadMessage: ThreadMessage = {
      createdBy: this.activeUserId || '',
      creatorName: user.name || '',
      creatorPhotoURL: user.photoURL || '',
      message: this.messageContent.trim(),
      timestamp: new Date(),
      reactions: [],
      isThreadMessage: true,
      sameDay: false,
    };

    // Sende die Nachricht über den Service
    if (this.messageId) {
      this.messagesService
        .addThreadMessage(this.messageId, threadMessage)
        .then(() => {
          this.messageContent = '';
        })
        .catch((error) => {
          console.error('Fehler beim Senden der Thread-Nachricht:', error);
        });
    } else {
      console.error('Keine gültige Message-ID für den Thread verfügbar.');
    }
  }

  toggleEmojiPickerMain() {
    if (
      !this.isMessageBoxMainPickerOpen &&
      !this.isMessageBoxThreadPickerOpen
    ) {
      this.emojiPickerService.closeChatBoxEmojiPicker( 'toggleEmojiPickerMain function 307');
      this.emojiPickerService.openMsgBoxEmojiPickerMain();
    } else if (this.isMessageBoxMainPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
    } else if (this.isMessageBoxThreadPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
      this.emojiPickerService.closeChatBoxEmojiPicker( 'toggleEmojiPickerMain function 313');
      this.emojiPickerService.openMsgBoxEmojiPickerMain();
    }
  }

  toggleEmojiPickerThread() {
    if (
      !this.isMessageBoxMainPickerOpen &&
      !this.isMessageBoxThreadPickerOpen
    ) {
      this.emojiPickerService.closeChatBoxEmojiPicker('toggleEmojiPickerThread function 323');
      this.emojiPickerService.openMsgBoxEmojiPickerThread();
    } else if (this.isMessageBoxThreadPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
    } else if (this.isMessageBoxMainPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
      this.emojiPickerService.closeChatBoxEmojiPicker( 'toggleEmojiPickerThread function 329');
      this.emojiPickerService.openMsgBoxEmojiPickerThread();
    }
  }

  toggleEmojiPickerCreateMessage() {
    if (this.isMessageBoxCreateMessagePickerOpen) {
      this.emojiPickerService.closeMsgBoxCreateMessageEmojiPicker();
    } else {
      this.emojiPickerService.openMsgBoxCreateMessageEmojiPicker();
    }
  }

  preventMsgBoxEmojiPickerClose(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeEmojiPicker(event: Event): void {
    if (this.isMessageBoxMainPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerMain();
    } else if (this.isMessageBoxThreadPickerOpen) {
      this.emojiPickerService.closeMsgBoxEmojiPickerThread();
    }
  }
  closeMentionPicker(event: Event) {
    this.mentionPicker = false;
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
    if (event.getModifierState('AltGraph') && event.key == "q") {
      this.mentionPicker = true;
    }
    if (event.key == "Backspace") {
      this.mentionPicker = false;
    }
  }

  toogleMentionPicker() {
    if (this.mentionPicker) {
      this.mentionPicker = false;
    } else {
      this.mentionPicker = true;
    }
  }

  preventMsgBoxMentionPickerClose(event: Event): void {
    event.stopPropagation();
  }
  
}
