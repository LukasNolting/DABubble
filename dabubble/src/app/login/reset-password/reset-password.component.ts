import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  standalone: true,   // <-- Add this line
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  warnText: string = "Ihre Kennwörter stimmen nicht überein";
  passwordmatch: boolean = false;
  passwords = {
    password: "",
    password2: "",
  };
  successMessage: string = '';
  errorMessage: string = '';
  oobCode: string = ''; // Der Reset-Code aus der URL


  constructor(private router: Router, private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Den `oobCode` aus der URL extrahieren
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'] || '';
      if (!this.oobCode) {
        this.errorMessage = 'Ungültiger oder fehlender Link.';
      }
    });
  }


  back() {
    this.router.navigateByUrl('');
  }

  changePassword(ngform: NgForm) {
    if (ngform.valid && ngform.submitted && this.checkPasswordsMatch()) {
      console.log(this.passwords);
      //this.auth.updateUserPassword(this.passwords.password);
      this.auth.confirmPasswordReset(this.oobCode, this.passwords.password)
        .then(() => {
          this.successMessage = 'Das Passwort wurde erfolgreich zurückgesetzt.';
          this.errorMessage = '';
        })
    }
  }

  checkPasswordsMatch() {
    let a = this.passwords;
    if (a.password === a.password2) {
      this.passwordmatch = true;
      return true;
    } else {
      console.log("passwörter stimmen nicht überein");
      this.passwordmatch = false;
      return false;
    }
  }
}
