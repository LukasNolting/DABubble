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
  searchResultsActive = false;
  searchText: string = '';
  searchResults: any[] = [];
  isSearchActive: boolean = false;
  isSearchTouched: boolean = false;

  constructor(private searchService: SearchService) {
    this.searchService.searchResults$.subscribe((results) => {
      this.searchResults = results;
      console.log('Search results:', this.searchResults);
    });
  }

  onInputChange(): void {
    this.isSearchActive = this.searchText.length >= 4;
    this.isSearchTouched = this.searchText.length > 0;
    if (this.searchText.length >= 4) {
      this.searchService.searchMessages(this.searchText);
    }
  }
}
