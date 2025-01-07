import { inject, Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { BehaviorSubject, from } from 'rxjs';
import { Message } from '../../models/message';
import { AuthService } from './auth.service';
import { UserModel } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  messageService = inject(MessagesService);
  authService = inject(AuthService);

  // BehaviorSubject, um die Suchergebnisse zu speichern
  private messageResultsSubject = new BehaviorSubject<any[]>([]);
  messageResults$ = this.messageResultsSubject.asObservable();
  private userResultsSubject = new BehaviorSubject<any[]>([]);
  userResults$ = this.userResultsSubject.asObservable();
  private allMessages: Message[] = [];
  private allUsers: UserModel[] = [];

  constructor() {
  }

  public loadMessages(): void {
    from(this.messageService.getAllMessages()).subscribe((messages) => {
      this.allMessages = Array.isArray(messages) ? messages : [];
      console.log('Messages loaded:', this.allMessages);
    });
  }
  public loadUsers(): void {
    this.authService.getUserList().subscribe((users) => {
      this.allUsers = Array.isArray(users)
        ? users.filter((user) => user.provider !== 'anonymous')
        : [];

      console.log('Users loaded:', this.allUsers);
    });
  }

  // Filterfunktion für die Suche
  searchMessages(searchText: string): void {
    if (!searchText) {
      this.messageResultsSubject.next([]);
      return;
    }

    const filteredMessages = this.allMessages.filter((message) =>
      message.message.toLowerCase().includes(searchText.toLowerCase())
    );

    this.messageResultsSubject.next(filteredMessages);
  }


  searchUsers(searchText: string): void {
    if (!searchText) {
      this.userResultsSubject.next([]);
      return;
    }
    const filteredUsers = this.allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );
    this.userResultsSubject.next(filteredUsers);
  }
}
