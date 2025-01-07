import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { verifyPasswordResetCode, applyActionCode } from '@angular/fire/auth';

@Component({
  selector: 'app-email-verification',
  template: `<h1>Verifiziere deine E-Mail</h1>`,
})
export class EmailVerificationComponent implements OnInit {
  constructor(private route: ActivatedRoute, private auth: Auth) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const oobCode = params['oobCode'];
      const mode = params['mode'];

      try {
        if (mode === 'signIn') {
          await applyActionCode(this.auth, oobCode);
          console.log('E-Mail erfolgreich verifiziert!');
        } else {
          console.error('Unbekannter Modus:', mode);
        }
      } catch (error) {
        console.error('Fehler beim Verifizieren der E-Mail:', error);
      }
    });
  }
}
