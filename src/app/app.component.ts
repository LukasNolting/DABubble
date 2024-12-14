import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../app/models/user';

@Component({
  selector: 'app-root',
  standalone: true,   // <-- Add this line
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DABubble';
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  user: User = new User();
  tokens: string[] = [];

  constructor() {
    const usersCollection = collection(this.firestore, 'users');

    this.items$ = collectionData(usersCollection, { idField: 'id' });

    this.getUser();
  }

  getUser() {
    const usersCollection = collection(this.firestore, 'users');

    const users$: Observable<any[]> = collectionData(usersCollection, {
      idField: 'userId',
    });

    users$
      .pipe(
        map((users) =>
          users.find(
            (user) =>
              user.email ===
              // #TODO: this.user.email
              'email@email.com'
          )
        )
      )
      .subscribe((foundUser) => {
        if (foundUser) {
          const token = foundUser.name;
          this.tokens.push(token);
          console.log('Token:', this.tokens);
        } else {
          console.warn('Kein Benutzer mit der angegebenen E-Mail gefunden.');
        }
      });
  }
}
