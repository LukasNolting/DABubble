import { Component, Input } from '@angular/core';
import { ChatboxComponent } from '../shared/chatbox/chatbox.component';
import { MessageboxComponent } from '../shared/messagebox/messagebox.component';
import { MainchatHeaderComponent } from './mainchat-header/mainchat-header.component';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-mainchat',
  standalone: true,
  imports: [MainchatHeaderComponent, ChatboxComponent, MessageboxComponent],
  templateUrl: './mainchat.component.html',
  styleUrls: ['./mainchat.component.scss'] // Korrigiere styleUrl zu styleUrls (Plural)
})
export class MainchatComponent {
  @Input() builder!: string;
  constructor() {}
}
