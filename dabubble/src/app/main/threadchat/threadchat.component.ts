import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageboxComponent } from '../shared/messagebox/messagebox.component';
import { ThreadchatHeaderComponent } from './threadchat-header/threadchat-header.component';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from '../shared/chatbox/chatbox.component';

@Component({
  selector: 'app-threadchat',
  standalone: true,
  imports: [ThreadchatHeaderComponent, ChatboxComponent, MessageboxComponent, CommonModule],
  templateUrl: './threadchat.component.html',
  styleUrls: ['./threadchat.component.scss'],
})
export class ThreadchatComponent implements OnInit {
  @Input() builder!: 'mainchat' | 'threadchat';
  ngOnInit(): void {}
}