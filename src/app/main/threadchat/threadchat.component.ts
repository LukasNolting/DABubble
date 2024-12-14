import { Component } from '@angular/core';
import { ChatboxComponent } from '../shared/chatbox/chatbox.component';
import { MessageboxComponent } from '../shared/messagebox/messagebox.component';
import { ThreadchatHeaderComponent } from './threadchat-header/threadchat-header.component';
import { Thread } from '../../models/thread';

@Component({
  selector: 'app-threadchat',
  standalone: true,   // <-- Add this line
  imports: [ThreadchatHeaderComponent, ChatboxComponent, MessageboxComponent],
  templateUrl: './threadchat.component.html',
  styleUrl: './threadchat.component.scss',
})
export class ThreadchatComponent {
thread?: Thread = {
  id: '',
  name: '',
  description: '',
  createdBy: '',
  messages: ['', ''],
  messageDate: '',
  messageTime: '',
}
  
}
