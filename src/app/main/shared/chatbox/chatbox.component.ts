import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  imports: [],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss',
})
export class ChatboxComponent {
  threadMessages: {
    userId: number;
    threadId: number;
    avatarPath: string;
    msgId: number;
    name: string;
    msgTime: string;
    msg: string;
  }[] = [
    //Example Data
    {
      userId: 1,
      threadId: 1,
      avatarPath: '/img/avatars/avatar1.svg',
      msgId: 1,
      name: 'Noah Braun',
      msgTime: '14:25 Uhr',
      msg: 'Welche Version ist aktuell von Angular?',
    },
    {
      userId: 2,
      threadId: 1,
      avatarPath: '/img/avatars/avatar2.svg',
      msgId: 2,
      name: 'Sofia Müller',
      msgTime: '14:30 Uhr',
      msg: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
    },
    {
      userId: 3,
      threadId: 1,
      avatarPath: '/img/avatars/avatar3.svg',
      msgId: 1,
      name: 'Frederik Beck',
      msgTime: '15:06 Uhr',
      msg: 'Ja das ist es.',
    },
  ];
}
