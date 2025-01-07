import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { UserModel } from '../../models/user';



@Component({
  selector: 'app-sign-up',
  standalone: true,   // <-- Add this line
  imports: [CommonModule, FormsModule, ChooseAvatarComponent, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  avatar: boolean = false;
  user = new UserModel(null);

  userData = {
    name: "",
    email: "",
    password: "",
    privacy: false,
    photoURL: "",
  }


  constructor(private router: Router, private auth: AuthService) { }

  back() {
    this.router.navigateByUrl('');
  }

  signUp(form: NgForm) {
    if (form.valid && form.submitted) {
      // console.log(this.userData);
      this.avatar = true;
      //this.auth.sendEmail(this.userData.email);
      // this.auth.register(this.userData.email, this.userData.password);
      // console.log("mail sent to", this.userData.email);
      // this.router.navigateByUrl('chooseAvatar');
    }
  }

  close() {
    this.avatar = false;
  }
}
