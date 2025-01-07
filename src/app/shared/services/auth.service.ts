import { Inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  confirmPasswordReset,
  updateProfile,
  updateEmail,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  deleteDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user';
import { ToastMessageService } from './toastmessage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public avatarCache = new Map<string, string>();
  private cacheExpirationTime = 3600000; // 1 Stunde in Millisekunden
  private avatarCacheTimestamps = new Map<string, number>();
  // Reactive signals
  userId = signal<string | null>(null);
  userData = signal<UserModel | null>(null);
  isUserAuthenticated = signal<boolean>(false);
  loginError = signal<string>('');
  userList = signal<UserModel[]>([]);
  public loadingSpinnerBoard: boolean = true;
  private loginType = signal<'guest' | 'google' | 'email' | null>(null);
  currentUser = signal<UserModel | null>(null); // Typisiertes Signal
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Firebase-User in eigenes Modell umwandeln
        const userModel = new UserModel(firebaseUser);
        this.currentUser.set(userModel); // Typisiertes Signal
      } else {
        this.currentUser.set(null); // Kein Benutzer angemeldet
      }
    });

    this.monitorAuthState(); // Überwachung des Auth-Status starten
    this.getUserList(); // Benutzerliste aus Firestore laden
    this.intializeUserData(); // Benutzer-Daten initialisieren
  }

  /**
   * Bestätigt den Passwort-Reset mit dem erhaltenen oobCode und setzt das neue Passwort.
   */
  confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, oobCode, newPassword);
  }

  /**
  // sendEmail(email: string) {
  //   const actionCodeSettings = {
  //     // URL you want to redirect back to. The domain (www.example.com) for this
  //     // URL must be in the authorized domains list in the Firebase Console.
  //     url: 'https://dab.christophvoelker.com/finishSignUp2',

  //     // This must be true.
  //     handleCodeInApp: true,
  //     // iOS: {
  //     //   bundleId: 'com.example.ios',
  //     // },
  //     // android: {
  //     //   packageName: 'com.example.android',
  //     //   installApp: true,
  //     //   minimumVersion: '12',
  //     // },
  //     //dynamicLinkDomain: 'dab.christophvoelker.com'
  //   };
  //   const auth = getAuth();
  //   //console.log(auth);

  //   sendSignInLinkToEmail(auth, email, actionCodeSettings)
  //     .then(() => {
  //       // The link was successfully sent. Inform the user.
  //       // Save the email locally so you don't need to ask the user for it again
  //       // if they open the link on the same device.
  //       console.log('Sign-in email sent successfully.');
  //       window.localStorage.setItem('emailForSignIn', email);
  //       // ...
  //     })
  //     .catch((error) => {
  //       console.error('Error sending email:', error.code, error.message);
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ...
  //     });
  // }

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
    localStorage.removeItem('userData');
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
  // async register(email: string, password: string): Promise<void> {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       this.auth,
  //       email,
  //       password
  //     );

  //     const user = userCredential.user;

  //     // Sende E-Mail-Bestätigung
  //     if (user) {
  //       await sendEmailVerification(user);
  //       console.log('Verification email sent to:', user.email);
  //     }

  //     const userData = this.setUserData(
  //       user.uid,
  //       user.displayName || '',
  //       user.email || '',
  //       user.photoURL || '',
  //       user.providerData[0].providerId || ''
  //     );

  //     await setDoc(doc(this.firestore, 'users', user.uid), userData);
  //   } catch (error) {
  //     console.error('Registration failed:', error);
  //   }
  // }

  async register(
    email: string,
    password: string,
    name: string,
    photoURL: string
  ): Promise<void> {
    console.log('registerIncomingData', email, password, name, photoURL);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('userCredential', userCredential.user);

      const user = userCredential.user;

      // Sende E-Mail-Bestätigung
      if (user) {
        await sendEmailVerification(user);
        console.log('Verification email sent to:', user.email);
      }

      const userData = this.setUserData(
        user.uid,
        name || '',
        user.email || '',
        photoURL || '',
        'password'
      );
      console.log('userData', userData);

      await setDoc(doc(this.firestore, 'users', user.uid), userData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  /**
   * Passwort zurücksetzen
   */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Passwort updaten
   */
  updateUserPassword(newPassword: string): Promise<void> {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      return updatePassword(currentUser, newPassword);
    } else {
      return Promise.reject('Kein Benutzer ist angemeldet.');
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
      console.log('Login successful:', userCredential.user);

      this.userId.set(userCredential.user.uid);
      this.updateDataInFirestore(userCredential.user.uid, { status: true });
      await this.loadUserData(userCredential.user.uid);
      setTimeout(() => {
        this.toastMessageService.showToastSignal('Erfolgreich eingeloggt');
      }, 1000);
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
      await this.loadUserData(user.uid);
      setTimeout(() => {
        this.toastMessageService.showToastSignal('Erfolgreich eingeloggt');
      }, 1000);
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
      console.log('Google login successful:', user);

      const userData = this.setUserData(
        user.uid,
        user.displayName || '',
        user.email || '',
        'img/avatars/picPlaceholder.svg',
        user.providerData[0].providerId || '',
        true
      );
      await setDoc(doc(this.firestore, `users/${user.uid}`), userData);
      await this.loadUserData(user.uid);
      setTimeout(() => {
        this.toastMessageService.showToastSignal('Erfolgreich eingeloggt');
      }, 1000);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }

  private setUserDataInStorage(userData: UserModel) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserDataFromStorage() {
    this.userData.set(JSON.parse(localStorage.getItem('userData') || '{}'));
  }

  intializeUserData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataFromStorage();
    }
  }

  /**
   * Logout
   */
  logout(): void {
    let userId = this.userData()?.userId;
    if (userId && this.userData()?.provider !== 'anonymous') {
      this.auth.signOut().then(() => {
        this.clearAuthState();
        this.updateDataInFirestore(userId, { status: false });
        this.router.navigate(['']);
        this.toastMessageService.showToastSignal('Erfolgreich ausgeloggt');
      });
    }
    if (this.userData()?.provider === 'anonymous') {
      console.log('Anonymous user logged out');
      this.deleteAnonymousUserFromFirestore();
      this.auth.signOut().then(() => {
        this.clearAuthState();
        this.router.navigate(['']);
        this.toastMessageService.showToastSignal('Erfolgreich ausgeloggt');
      });
    }
  }

  deleteAnonymousUserFromFirestore(): void {
    const user = this.auth.currentUser;
    console.log('user', user);

    if (user) {
      deleteDoc(doc(this.firestore, `users/${user.uid}`));
      user.delete().then(() => {
        console.log('Anonymous user deleted');
      });
    }
  }

  /**
   * Benutzerdaten laden
   */
  async loadUserData(userId: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (userDoc.exists()) {
        this.userData.set(userDoc.data() as UserModel);
        this.setUserDataInStorage(userDoc.data() as UserModel);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  async checkUserId(userId: string) {
    if (userId) {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      return userDoc.exists();
    } else {
      return false;
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
    throw error
  }

  /**
   * Benutzerinformationen für Firestore erstellen
   */
  private setUserData(
    userId: string,
    username: string,
    email: string,
    avatarURL: string,
    provider: string = '',
    status: boolean = false
  ): UserModel {
    return {
      userId,
      name: username,
      email,
      photoURL: avatarURL,
      channels: [],
      privateNoteRef: '',
      status: status,
      provider: provider,
    };
  }

  /**
   * Gast-Benutzerdaten erstellen
   */
  private setAnonymousUserData(userId: string): UserModel {
    return {
      userId,
      name: 'Gast',
      email: 'gast@gast.de',
      photoURL: 'img/avatars/picPlaceholder.svg',
      channels: [],
      privateNoteRef: '',
      status: true,
      provider: 'anonymous',
    };
  }

  /**
   * Alle Benutzer aus Firestore laden
   */
  private getUserList(): void {
    const userCollection = collection(this.firestore, 'users');
    onSnapshot(userCollection, (snapshot) => {
      const users: UserModel[] = [];
      snapshot.forEach((doc) => {
        users.push(doc.data() as UserModel);
      });
      this.userList.set(users);
    });
  }

  redirectIfAuthenticated(): void {
    if (this.auth.currentUser) {
      this.router.navigate(['/board']);
    } else {
      this.router.navigate(['/']);
    }
  }

  async getUserById(userId: string | null): Promise<UserModel | null> {
    const userDoc = await getDoc(doc(this.firestore, `users/${userId}`));
    return userDoc.exists() ? (userDoc.data() as UserModel) : null;
  }

  /**
   * Ruft die Avatar-URL eines Benutzers ab und verwendet einen Cache für Performance.
   */
  async getCachedAvatar(userId: string): Promise<string> {
    const now = Date.now();

    if (this.avatarCache.has(userId)) {
      const cachedTime = this.avatarCacheTimestamps.get(userId);
      if (cachedTime && now - cachedTime < this.cacheExpirationTime) {
        return this.avatarCache.get(userId)!;
      }
    }

    try {
      const userDoc = await getDoc(doc(this.firestore, `users/${userId}`));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserModel;
        const avatarUrl = userData.photoURL || 'img/avatars/picPlaceholder.svg';
        this.avatarCache.set(userId, avatarUrl);
        this.avatarCacheTimestamps.set(userId, now);
        return avatarUrl;
      } else {
        return 'img/avatars/picPlaceholder.svg';
      }
    } catch (error) {
      return 'img/avatars/picPlaceholder.svg';
    }
  }

  // async updateUserData(
  //   userId: string,
  //   updatedData: Partial<UserModel>
  // ): Promise<void> {
  //   try {
  //     const userDocRef = doc(this.firestore, `users/${userId}`);
  //     await updateDoc(userDocRef, updatedData);
  //     const updatedUserDoc = await getDoc(userDocRef);
  //     if (updatedUserDoc.exists()) {
  //       const updatedUserData = updatedUserDoc.data() as UserModel;
  //       localStorage.setItem('userData', JSON.stringify(updatedUserData));
  //       this.userData.set(updatedUserData);
  //       this.toastMessageService.showToastSignal(
  //         'Benutzerdaten erfolgreich aktualisiert'
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Fehler beim Aktualisieren der Benutzerdaten:', error);
  //     this.toastMessageService.showToastSignal(
  //       'Fehler beim Aktualisieren der Benutzerdaten'
  //     );
  //   }
  // }

  async updateUserData(
    userId: string,
    updatedData: Partial<UserModel>
  ): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      await updateDoc(userDocRef, updatedData);
      const updatedUserDoc = await getDoc(userDocRef);
      if (updatedUserDoc.exists()) {
        const updatedUserData = updatedUserDoc.data() as UserModel;
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        this.userData.set(updatedUserData);

        // Update Firebase Auth profile
        const user = this.auth.currentUser;
        if (user) {
          if (updatedData.name) {
            await updateProfile(user, { displayName: updatedData.name });
            this.updateDataInFirestore(userId, { name: updatedData.name });
          }
          if (updatedData.email) {
            await updateEmail(user, updatedData.email);
            this.updateDataInFirestore(userId, { email: updatedData.email });
          }
        }

        this.toastMessageService.showToastSignal(
          'Benutzerdaten erfolgreich aktualisiert'
        );
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Benutzerdaten:', error);
      this.toastMessageService.showToastSignal(
        'Fehler beim Aktualisieren der Benutzerdaten'
      );
    }
  }

  updateDataInFirestore(userId: string, updatedData: Partial<UserModel>) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    updateDoc(userDocRef, updatedData);
  }

  async getUsernamesByIds(userIds: string[]): Promise<{ name: string; userId: string; photoURL: string; email: string; status: boolean }[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }
  
    try {
      const usersCollection = collection(this.firestore, 'users');
      const userDocsQuery = query(usersCollection, where('userId', 'in', userIds));
      const querySnapshot = await getDocs(userDocsQuery);
  
      const userDetails = querySnapshot.docs.map(doc => {
        const data = doc.data() as UserModel;
        return {
          name: data.name,
          userId: data.userId,
          photoURL: data.photoURL,
          email: data.email,
          status: data.status,
        };
      });
  
      // Sortiere die UserDetails alphabetisch nach Namen
      userDetails.sort((a, b) => a.name.localeCompare(b.name));
  
      return userDetails;
    } catch (error) {
      console.error('Error fetching and sorting user details:', error);
      return [];
    }
  }
  }
