import { NgStyle, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { ToastMessageService } from '../shared/services/toastmessage.service';
import { ToastMessageComponent } from '../shared/toastmessage/toastmessage.component';

@Component({
  selector: 'app-login',
  standalone: true, // <-- Add this line
  imports: [RouterOutlet, RouterModule, NgClass, ToastMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginPage: boolean = true;
  introPlayed: boolean = false;

  constructor(public router: Router, private toastMessageService: ToastMessageService) {
    this.checkside();

    // check if it was played
    let introPlayedVar = localStorage.getItem('introPlayed');
    if (introPlayedVar !== null) {
      this.introPlayed = JSON.parse(introPlayedVar);
    }

    // save entry after delay
    setTimeout(() => {
      this.introPlayed = true;
      localStorage.setItem('introPlayed', JSON.stringify(this.introPlayed));
    }, 6000);
  }

  homeroute: any = '';

  checkside() {
    setInterval(() => {
      if (this.router.routerState.snapshot.url == '/') {
        this.loginPage = true;
      } else {
        this.loginPage = false;
      }
    },100)
  }

  get toastMessage() {
    return this.toastMessageService.toastSignal();
  }
}
