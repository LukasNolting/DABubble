import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserModel } from '../app/models/user';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'DABubble';
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  user: UserModel = new UserModel(null);  tokens: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const usersCollection = collection(this.firestore, 'users');
    this.items$ = collectionData(usersCollection, { idField: 'id' });
  }

  ngOnInit(): void {
    const isAuthenticated = this.authService.isUserAuthenticated();
    if (isAuthenticated && this.router.url === '/') {
      console.log('User is authenticated, redirecting to /board');
      this.router.navigateByUrl('/board');
    }
  }

}
