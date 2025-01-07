import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { getAuth, applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

@Component({
  selector: 'app-finish-sign-up',
  standalone: true,
  templateUrl: './finish-sign-up.component.html',
  imports: [CommonModule], // Hier das CommonModule importieren
  styleUrls: ['./finish-sign-up.component.scss']
})
export class FinishSignUpComponent implements OnInit {
  message: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('FinishSignUpComponent initialisiert'); // De
    const auth = getAuth();
    console.log(auth);
    const queryParams = this.route.snapshot.queryParams;
    console.log('Query-Parameter:', queryParams);
    const mode = queryParams['mode']; // z.B. 'verifyEmail' oder 'resetPassword'
    const oobCode = queryParams['oobCode']; // Der Code aus der Firebase-E-Mail
    const continueUrl = queryParams['continueUrl']; // Optional

    console.log('Modus:', mode, 'OOB-Code:', oobCode);

    if (mode && oobCode) {
      switch (mode) {
        case 'signIn':    //'verifyEmail':
          this.verifyEmail(auth, oobCode);
          break;
        case 'resetPassword':
          // Hier kannst du optional die Passwort-Reset-Logik einbauen
          this.resetPassword(auth, oobCode);
          break;
        default:
          this.message = 'Ungültiger Modus.';
      }
    } else {
      this.message = 'Ungültige oder fehlende Parameter in der URL.';
    }
  }

  verifyEmail(auth: any, oobCode: string): void {
    applyActionCode(auth, oobCode)
      .then(() => {
        this.message = 'E-Mail erfolgreich bestätigt!';
      })
      .catch((error) => {
        this.message = `Fehler beim Bestätigen der E-Mail: ${error.message}`;
      });
  }

  resetPassword(auth: any, oobCode: string): void {
    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        this.message = 'Passwort-Reset-Code bestätigt. Bitte gib ein neues Passwort ein.';
      })
      .catch((error) => {
        this.message = `Fehler beim Überprüfen des Passwort-Reset-Codes: ${error.message}`;
      });
  }
}
