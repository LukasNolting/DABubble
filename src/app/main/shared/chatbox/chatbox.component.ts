import { Component } from '@angular/core';
import { Thread } from '../../../models/thread';

@Component({
  selector: 'app-chatbox',
  standalone: true,   // <-- Add this line
  imports: [],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss',
})
export class ChatboxComponent {
  showDisplay = 'display:block';
  activeUserId: string = '3';
  threadMessages: {
    userId: string;
    threadId: number;
    avatarPath: string;
    msgId: number;
    name: string;
    msgTime: string;
    msg: string;
  }[] = [
    //Example Data
    {
      userId: '2',
      threadId: 1,
      avatarPath: '/img/avatars/avatar2.svg',
      msgId: 2,
      name: 'Sofia Müller',
      msgTime: '14:30 Uhr',
      msg: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
    },
    {
      userId: '3',
      threadId: 1,
      avatarPath: '/img/avatars/avatar3.svg',
      msgId: 1,
      name: 'Frederik Beck',
      msgTime: '15:06 Uhr',
      msg: 'Ja das ist es.',
    },
  ];

  threads: {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    userId: string;
    avatarPath: string;
    messages: string[];
    messageDate: string;
    messageTime: string;
  }[] = [
    {
      id: 't1',
      name: 'Noah Braun',
      description: 'Welche Version ist aktuell von Angular?',
      createdBy: 'Noah Braun',
      userId: '11',
      avatarPath: 'img/avatars/avatar4.svg',
      messages: ['m1', 'm2'],
      messageDate: '14.11.2024',
      messageTime: '14:25 Uhr',
    },
    {
      id: 't2',
      name: 'Frederik Beck',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac.',
      createdBy: 'Frederik Beck',
      userId: '3',
      avatarPath: 'img/avatars/avatar5.svg',
      messages: [],
      messageDate: '13.12.2024',
      messageTime: '15:06 Uhr',
    },
  ];
}
