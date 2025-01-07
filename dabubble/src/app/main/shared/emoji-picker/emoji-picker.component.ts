import { Component, EventEmitter, Output } from '@angular/core';
import { EmojiPicker } from "ngx-easy-emoji-picker";

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [EmojiPicker],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
@Output() selectEmoji = new EventEmitter<string>();

onSelectEmoji(emoji: string) {
  const decodedEmoji = this.decodeEmoji(emoji);
  this.selectEmoji.emit(decodedEmoji);
}

decodeEmoji(emoji: string){
  const parser = new DOMParser();
  const decodedEmoji =
    parser.parseFromString(emoji, 'text/html').documentElement.textContent ||
    emoji;
    return decodedEmoji;
}
}
