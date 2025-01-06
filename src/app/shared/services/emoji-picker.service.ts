import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  private isMessageBoxPickerOpen = new BehaviorSubject<boolean>(false);
  private isChatBoxPickerOpen = new BehaviorSubject<boolean>(false);
  private chatBoxEmojiPickerForId = new BehaviorSubject<string>('');

  isMessageBoxPickerOpen$ = this.isMessageBoxPickerOpen.asObservable();
  isChatBoxPickerOpen$ = this.isChatBoxPickerOpen.asObservable();
  chatBoxEmojiPickerForId$ = this.chatBoxEmojiPickerForId.asObservable();

  constructor() {}

  openMsgBoxEmojiPicker() {
    if (!this.isMessageBoxPickerOpen.getValue()) {
      this.isMessageBoxPickerOpen.next(true);
    }
  }

  closeMsgBoxEmojiPicker() {
    if (this.isMessageBoxPickerOpen.getValue()) {
      this.isMessageBoxPickerOpen.next(false);
    }
  }

  openChatBoxEmojiPicker(messageId: string) {
    this.isChatBoxPickerOpen.next(true);
    this.chatBoxEmojiPickerForId.next(messageId);
  }

   openNewChatBoxEmojiPicker(messageId: string){
    this.isChatBoxPickerOpen.next(false);
    this.chatBoxEmojiPickerForId.next(messageId);
    this.isChatBoxPickerOpen.next(true);
  }

  closeChatBoxEmojiPicker() {
    this.isChatBoxPickerOpen.next(false);
    this.chatBoxEmojiPickerForId.next('');
  }
}
