import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true, // Standalone Component
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  loginError = ''; // Fehlernachricht für das UI

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated, redirecting to /board');
      this.router.navigateByUrl('/board');
    }
    this.loginError = this.authService.loginError();
  }

  async login(ngForm: NgForm): Promise<void> {
    if (ngForm.valid && ngForm.submitted) {
      try {
        await this.authService.login(this.loginData.email, this.loginData.password);
        this.redirectToBoard();
      } catch (error) {
        this.loginError = 'Falsches Passwort oder E-Mail.. Bitte noch einmal versuchen.';
      }
    }
  }

  async loginAsGuest(): Promise<void> {
    try {
      await this.authService.guestLogin();
      this.redirectToBoard();
    } catch (error) {
      this.loginError = 'Guest login failed.';
      console.error('Guest login error:', error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.googleLogin();
      this.redirectToBoard();
    } catch (error) {
      this.loginError = 'Google login failed.';
      console.error('Google login error:', error);
    }
  }

  private redirectToBoard(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/board';
    this.router.navigateByUrl(returnUrl, { replaceUrl: true });
  }
}
