import { Component } from '@angular/core';
import { state, style, transition, animate, trigger } from '@angular/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

// state('start', style({})),
// state('stop', style({ "top": "10%", "left": "10%", "width": "50px" })),

@Component({
  selector: 'app-intro',
  standalone: true,   // <-- Add this line
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})

export class IntroComponent {

}

