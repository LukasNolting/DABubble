import { Component, EventEmitter, Output } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerComponent, EmojiComponent],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss',
})
export class EmojiPickerComponent {
  @Output() emoji = new EventEmitter<string>();

  // onSelectEmoji(emoji: string) {
  //   const decodedEmoji = this.decodeEmoji(emoji);
  //   this.selectEmoji.emit(decodedEmoji);
  // }

  decodeEmoji(emoji: string) {
    const parser = new DOMParser();
    const decodedEmoji =
      parser.parseFromString(emoji, 'text/html').documentElement.textContent ||
      emoji;
    return decodedEmoji;
  }

  onSelectEmoji(event: any) {
    const selectedEmoji = event.emoji.native;
    console.log(event);
    console.log(selectedEmoji);
    this.emoji.emit(selectedEmoji);
  }
}
