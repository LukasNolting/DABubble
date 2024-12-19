import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finish-sign-up',
  standalone: true,
  imports: [],
  templateUrl: './finish-sign-up.component.html',
  styleUrl: './finish-sign-up.component.scss'
})
export class FinishSignUpComponent {


  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute) { }

  ngOnInit() {
    // Extrahiere den oobCode aus der URL
    this.route.queryParams.subscribe(params => {
      const oobCode = params['oobCode'];
      if (oobCode) {
        this.afAuth.applyActionCode(oobCode)
          .then(() => {
            console.log('E-Mail wurde erfolgreich bestätigt!');
          })
          .catch(error => {
            console.error('Fehler bei der Bestätigung', error);
          });
      }
    });
  }






}
