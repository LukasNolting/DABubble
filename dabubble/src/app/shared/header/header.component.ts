import { Component, Input } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { UsermenuComponent } from './usermenu/usermenu.component';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,   // <-- Add this line
  imports: [LogoComponent, SearchbarComponent, UsermenuComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  currentUrl: string = '';
  

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }
}
