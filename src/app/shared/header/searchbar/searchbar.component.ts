import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { TimestampToDatePipe } from '../../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule, TimestampToDatePipe],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  messageResultsActive = false;
  searchText: string = '';
  messageResults: any[] = [];
  userResults: any[] = [];
  isSearchActive: boolean = false;
  isSearchTouched: boolean = false;

  constructor(private searchService: SearchService) {
    this.searchService.messageResults$.subscribe((results) => {
      this.messageResults = results;
      console.log('Search results messages:', this.messageResults);
    });
    this.searchService.userResults$.subscribe((results) => {
      this.userResults = results;
      console.log('Search results user:', this.userResults);
    });
  }

  onInputChange(): void {
    if (this.searchText.length == 1) {
      this.searchService.loadMessages();
      this.searchService.loadUsers();
    }

    this.isSearchActive = this.searchText.length >= 4;

    this.isSearchTouched = this.searchText.length > 0;

    if (this.searchText.length >= 4) {
      this.searchService.searchMessages(this.searchText);
      this.searchService.searchUsers(this.searchText);
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.isSearchActive = false;
    this.isSearchTouched = false;
    this.messageResults = [];
  }

  goToSearchResult(
    channelId: string | null,
    docId: string | null,
    userId: string | null
  ): void {
    console.log(
      'Navigating to:',
      'channelId: ',
      channelId,
      'docId: ',
      docId,
      'userId: ',
      userId
    );
    alert('Zu früh gefreut, ist noch nicht fertig!');
    this.clearSearch();
  }
}