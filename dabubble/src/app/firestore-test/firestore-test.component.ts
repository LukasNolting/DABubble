import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { addDoc, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastMessageService } from '../shared/services/toastmessage.service';

@Component({
  selector: 'app-firestore-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './firestore-test.component.html',
  styleUrls: ['./firestore-test.component.scss'],
})
export class FirestoreTestComponent implements OnInit {
  testData$: Observable<any[]> | undefined;

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {}

  email: string = '';
  password: string = '';

  // register() {
  //   this.auth.register(this.email, this.password);
  // }

  // get userId() {
  //   return this.auth.userId();
  // }

  loginEmail: string = '';
  loginPassword: string = '';
  // get userData() {
  //   return this.auth.userData();
  // }

  get errorLogin() {
    return this.auth.loginError();
  }
  login() {
    this.auth.login(this.loginEmail, this.loginPassword);
  }

  guestLogin() {
    this.auth.guestLogin();
  }

  googleLogin() {
    this.auth.googleLogin();
  }

  // logout() {
  //   this.auth.logout();
  // }

  // get userList() {
  //   return this.auth.userList();
  // }

  showError() {
    this.toastMessageService.showToast(true, 'Ein Fehler ist aufgetreten');
    console.log('Error');
  }

  showSuccess() {
    this.toastMessageService.showToast(false, 'Operation erfolgreich!');
    console.log('Success');
  }

  showToastSignal() {
    this.toastMessageService.showToastSignal('Ein Fehler ist aufgetreten');
  }
}
