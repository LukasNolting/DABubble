export class User {
  userId: string;
  name: string;
  status: boolean = false;
  photoURL: string;
  channels: string[] = [];
  email: string;
  privateNoteRef: string;

  constructor(obj?: any) {
    this.userId = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.status = obj ? obj.status : false;
    this.photoURL = obj ? obj.photoURL : '';
    this.channels = obj ? obj.channels : [];
    this.email = obj ? obj.email : '';
    this.privateNoteRef = obj ? obj.privateNoteRef : '';
  }
}
