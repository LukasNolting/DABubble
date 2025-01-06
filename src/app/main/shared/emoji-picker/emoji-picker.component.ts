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

  onSelectEmoji(event: any) {
    const selectedEmoji = event.emoji.native;
    this.emoji.emit(selectedEmoji);
  }
}
