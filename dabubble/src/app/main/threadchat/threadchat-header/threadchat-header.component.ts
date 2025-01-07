import { Component } from '@angular/core';
import { MessagesService } from '../../../shared/services/messages.service';

@Component({
  selector: 'app-threadchat-header',
  standalone: true,   // <-- Add this line
  imports: [],
  templateUrl: './threadchat-header.component.html',
  styleUrl: './threadchat-header.component.scss'
})
export class ThreadchatHeaderComponent {
    constructor(private messagesService: MessagesService) {}

    // Funktion zum Schließen des Threadchats
    closeThreadChat(): void {
      this.messagesService.closeThreadChat();
    }
}
