import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-imprint',
  standalone: true,   // <-- Add this line
  imports: [HeaderComponent, RouterModule ],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
