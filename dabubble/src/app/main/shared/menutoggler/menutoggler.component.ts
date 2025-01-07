import { NgClass } from '@angular/common';
import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-menutoggler',
  standalone: true,   // <-- Add this line
  imports: [NgClass],
  templateUrl: './menutoggler.component.html',
  styleUrl: './menutoggler.component.scss'
})
export class MenutogglerComponent {
  @Input() menuState!: string;
}
