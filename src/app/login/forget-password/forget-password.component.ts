import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,   // <-- Add this line
  imports: [CommonModule ,FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  
  form = {
    email: "",
  }

  constructor(private router: Router) {}
  
  back() {
    this.router.navigateByUrl('');
  }

  sendMail(ngForm: NgForm) {

  }
}
