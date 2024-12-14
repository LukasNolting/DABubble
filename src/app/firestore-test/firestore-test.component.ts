import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { addDoc, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-firestore-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './firestore-test.component.html',
  styleUrls: ['./firestore-test.component.scss'],
})
export class FirestoreTestComponent implements OnInit {
  testData$: Observable<any[]> | undefined;

  constructor(private firestore: Firestore, private auth: AuthService) {}

  ngOnInit(): void {
    this.testFirestoreConnection();
  }

  testFirestoreConnection(): void {
    const testCollection = collection(this.firestore, 'users');
    this.testData$ = collectionData(testCollection);

    this.testData$.subscribe(
      (data) => console.log('Daten erfolgreich abgerufen:', data),
      (error) => console.error('Fehler beim Abrufen der Daten:', error)
    );
  }

  writeData(): void {
    const testCollection = collection(this.firestore, 'users'); // Ziel-Sammlung

    const localData = [{
      "name": "Otto Peters",
      "email": "otto@peters.de",
      "password": "password123",
      "status": false,
      "avatarURL": "avatarURL",
      "userId": 1,
      "channels": ["Channel1"],
      "privateNoteRef": "???"
    }, {
      "name": "Max Mustermann",
      "email": "max@mustermann.de",
      "password": "password123",
      "status": false,
      "avatarURL": "avatarURL",
      "userId": 2,
      "channels": ["Channel1"],
      "privateNoteRef": "???"
    }, {
      "name": "Ralf Mongolo",
      "email": "ralf@mongolo.de",
      "password": "password123",
      "status": false,
      "avatarURL": "avatarURL",
      "userId": 3,
      "channels": ["Channel1"],
      "privateNoteRef": "???"
    }]

    for (let i = 0; i < localData.length; i++) {

      addDoc(testCollection, localData[i])
        .then((docRef) => {
          console.log('Daten erfolgreich hinzugefügt mit ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Fehler beim Hinzufügen der Daten:', error);
        });

    }

  }

  email: string = '';
  password: string = '';
  register() {
    this.auth.register(this.email, this.password)
  }
  get userId() {
    return this.auth.userId();
  }


  loginEmail: string = '';
  loginPassword: string = '';
  get userData() {
    return this.auth.userData();
  }

  get errorLogin() {
    return this.auth.loginError();
  }
  login() {
    this.auth.login(this.loginEmail, this.loginPassword);
  }


  guestLogin() {
    this.auth.guestLogin();
  }


}
