import { User as FirebaseUser } from '@angular/fire/auth';

export class UserModel {
  userId: string; // Firebase-UID
  name: string; // displayName aus Firebase
  status: boolean = false; // Eigene Eigenschaft
  photoURL: string; // photoURL aus Firebase
  channels: string[] = []; // Eigene Eigenschaft
  email: string; // email aus Firebase
  privateNoteRef: string; // Eigene Eigenschaft
  provider: string; // Eigene Eigenschaft

  constructor(firebaseUser: FirebaseUser | null, additionalData?: Partial<UserModel>)  {
    // Firebase-Daten übernehmen
    this.userId = firebaseUser?.uid || '';
    this.name = firebaseUser?.displayName || '';
    this.photoURL = firebaseUser?.photoURL || '';
    this.email = firebaseUser?.email || '';

    // Zusätzliche Daten übernehmen
    this.status = additionalData?.status ?? false;
    this.channels = additionalData?.channels ?? [];
    this.privateNoteRef = additionalData?.privateNoteRef || '';
    this.provider = additionalData?.provider || '';
  }
}