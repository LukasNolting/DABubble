import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legalnotice',
  standalone: true,   // <-- Add this line
  imports: [HeaderComponent, RouterModule],
  templateUrl: './legalnotice.component.html',
  styleUrl: './legalnotice.component.scss'
})
export class LegalnoticeComponent {

}
