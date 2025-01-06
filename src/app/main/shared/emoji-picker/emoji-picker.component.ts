import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerComponent],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss',
})
export class EmojiPickerComponent {
  @Output() emoji = new EventEmitter<string>();
  @Input({required: true}) componentName!: 'chatbox' | 'messagebox'; 

  onSelectEmoji(event: any) {
    const selectedEmoji = event.emoji.native;
    this.emoji.emit(selectedEmoji);
  }
}
