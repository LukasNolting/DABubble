import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  private isMessageBoxMainPickerOpen = new BehaviorSubject<boolean>(false);
  private isMessageBoxThreadPickerOpen = new BehaviorSubject<boolean>(false);
  private isChatBoxPickerOpen = new BehaviorSubject<boolean>(false);
  private chatBoxEmojiPickerForId = new BehaviorSubject<string>('');

  isMessageBoxMainPickerOpen$ = this.isMessageBoxMainPickerOpen.asObservable();
  isMessageBoxThreadPickerOpen$ =
    this.isMessageBoxThreadPickerOpen.asObservable();
  isChatBoxPickerOpen$ = this.isChatBoxPickerOpen.asObservable();
  chatBoxEmojiPickerForId$ = this.chatBoxEmojiPickerForId.asObservable();

  constructor() {}

  openMsgBoxEmojiPickerMain() {
    this.isMessageBoxMainPickerOpen.next(true);
  }

  openMsgBoxEmojiPickerThread() {
    this.isMessageBoxThreadPickerOpen.next(true);
  }

  closeMsgBoxEmojiPickerMain() {
    this.isMessageBoxMainPickerOpen.next(false);
  }
  
  closeMsgBoxEmojiPickerThread() {
    this.isMessageBoxThreadPickerOpen.next(false);
  }

  openChatBoxEmojiPicker(messageId: string) {
    this.isChatBoxPickerOpen.next(true);
    this.chatBoxEmojiPickerForId.next(messageId);
  }

  openNewChatBoxEmojiPicker(messageId: string) {
    this.isChatBoxPickerOpen.next(false);
    this.chatBoxEmojiPickerForId.next(messageId);
    this.isChatBoxPickerOpen.next(true);
  }

  closeChatBoxEmojiPicker() {
    this.isChatBoxPickerOpen.next(false);
    this.chatBoxEmojiPickerForId.next('');
  }
}
