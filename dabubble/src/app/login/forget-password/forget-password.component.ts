import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,   // <-- Add this line
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  userData = {
    email: "",
  }

  constructor(private router: Router, private authService: AuthService) { }

  back() {
    this.router.navigateByUrl('');
  }

  sendMail(form: NgForm) {
    if (form.valid && form.submitted) {
      console.log(this.userData);
    }
    this.authService.resetPassword(this.userData.email).then(() => {
      console.log("erfolgreich mail verschickt!");
    })
      .catch((error) => {
        console.log(error);
      })
  }
}
