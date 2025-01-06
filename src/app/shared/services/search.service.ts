import { inject, Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { BehaviorSubject, from } from 'rxjs';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  messageService = inject(MessagesService);

  // BehaviorSubject, um die Suchergebnisse zu speichern
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor() {
    this.loadMessages();
  }

  // Nachrichten laden und zwischenspeichern
  private messages: Message[] = [];

  private loadMessages(): void {
    from(this.messageService.getAllMessages()).subscribe((messages) => {
      this.messages = Array.isArray(messages) ? messages : [];
      console.log('Messages loaded:', this.messages);
      
    });
  }

  // Filterfunktion für die Suche
  searchMessages(searchText: string): void {
    if (!searchText) {
      this.searchResultsSubject.next([]);
      return;
    }

    const filteredMessages = this.messages.filter((message) =>
      message.message.toLowerCase().includes(searchText.toLowerCase())
    );

    this.searchResultsSubject.next(filteredMessages);
  }
}
