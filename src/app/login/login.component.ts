import { NgStyle, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, NgStyle, RouterModule,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginPage: boolean = true;
  storgedUser: boolean = false;
  constructor(public router:Router) {
    this.checkside();
  }

  homeroute:any ="";
  
  checkside() {
    // if (this.router.routerState.snapshot.url == '/') {
    //   console.log(this.router.routerState.snapshot.url);
    //   this.loginPage = true;
    // } else {
    //   this.loginPage = false;
    // }
  }

}
