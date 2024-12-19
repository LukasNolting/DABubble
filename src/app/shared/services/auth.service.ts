import { Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  getAuth,
  sendSignInLinkToEmail,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User as AppUser } from '../../models/user';
import { ToastMessageService } from './toastmessage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Reactive signals
  userId = signal<string | null>(null);
  userData = signal<AppUser | null>(null);
  isUserAuthenticated = signal<boolean>(false);
  loginError = signal<string>('');
  userList = signal<AppUser[]>([]);
  private loginType = signal<'guest' | 'google' | 'email' | null>(null);

  constructor(
    public auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {
    this.monitorAuthState(); // Überwachung des Auth-Status starten
    this.getUserList(); // Benutzerliste aus Firestore laden
  }

  sendEmail(email: string) {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://dab.christophvoelker.com/finishSignUp',

      // This must be true.
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: 'com.example.ios',
      // },
      // android: {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12',
      // },
      //dynamicLinkDomain: 'dab.christophvoelker.com'
    };
    const auth = getAuth();
    //console.log(auth);

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        console.log('Sign-in email sent successfully.');
        window.localStorage.setItem('emailForSignIn', email);
        // ...
      })
      .catch((error) => {
        console.error('Error sending email:', error.code, error.message);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }

  /**
   * Überwacht den Firebase-Auth-Status
   */
  private monitorAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isUserAuthenticated.set(true);
        this.userId.set(user.uid);

        // Weiterleitung nur, wenn der Benutzer auf der Home-Route ist
        if (this.router.url === '/') {
          this.redirectIfAuthenticated();
        }
      } else {
        this.clearAuthState();
        console.log('No user logged in');
      }
    });
  }

  /**
   * Setzt den Auth-Status zurück
   */
  private clearAuthState(): void {
    this.userId.set(null);
    this.userData.set(null);
    this.isUserAuthenticated.set(false);
    this.loginType.set(null);
  }

  /**
   * Prüft, ob ein Benutzer eingeloggt ist
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser || this.isUserAuthenticated();
  }

  /**
   * Benutzer registrieren (E-Mail und Passwort)
   */
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      const userData = this.setUserData(
        user.uid,
        user.displayName || '',
        user.email || '',
        user.photoURL || ''
      );
      await setDoc(doc(this.firestore, 'users', user.uid), userData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  /**
   * Benutzer einloggen (E-Mail und Passwort)
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.userId.set(userCredential.user.uid);
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  /**
   * Gast-Login
   */
  async guestLogin(): Promise<void> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      const user = userCredential.user;
      const userData = this.setAnonymousUserData(user.uid);
      await setDoc(doc(this.firestore, `users/${user.uid}`), userData);
    } catch (error) {
      console.error('Anonymous login failed:', error);
    }
  }

  /**
   * Google-Login
   */
  async googleLogin(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      const userData = this.setUserData(
        user.uid,
        user.displayName || '',
        user.email || '',
        user.photoURL || ''
      );
      await setDoc(doc(this.firestore, `users/${user.uid}`), userData);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.auth.signOut().then(() => {
      this.clearAuthState();
      this.router.navigate(['']);
      this.toastMessageService.showToastSignal('Erfolgreich ausgeloggt');
    });
  }

  /**
   * Benutzerdaten laden
   */
  private async loadUserData(userId: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (userDoc.exists()) {
        this.userData.set(userDoc.data() as AppUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  /**
   * Fehler beim Login behandeln
   */
  private handleLoginError(error: any): void {
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      this.loginError.set('Invalid email or password');
    } else {
      this.loginError.set('Unexpected error occurred');
    }
    console.error('Login error:', error);
  }

  /**
   * Benutzerinformationen für Firestore erstellen
   */
  private setUserData(
    userId: string,
    username: string,
    email: string,
    avatarURL: string
  ): AppUser {
    return {
      userId,
      name: username,
      email,
      photoURL: avatarURL,
      channels: [],
      privateNoteRef: '',
      status: false,
    };
  }

  /**
   * Gast-Benutzerdaten erstellen
   */
  private setAnonymousUserData(userId: string): AppUser {
    return {
      userId,
      name: 'Guest',
      email: 'guest@guest.de',
      photoURL: 'img/avatars/picPlaceholder.svg',
      channels: [],
      privateNoteRef: '',
      status: true,
    };
  }

  /**
   * Alle Benutzer aus Firestore laden
   */
  private getUserList(): void {
    const userCollection = collection(this.firestore, 'users');
    onSnapshot(userCollection, (snapshot) => {
      const users: AppUser[] = [];
      snapshot.forEach((doc) => {
        users.push(doc.data() as AppUser);
      });
      this.userList.set(users);
    });
  }

  redirectIfAuthenticated(): void {
    if (this.auth.currentUser) {
      this.router.navigate(['/board']);
      this.toastMessageService.showToastSignal('Anmeldung erfolgreich');
    }
  }
}
