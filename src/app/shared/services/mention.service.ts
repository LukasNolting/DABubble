import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MentionService {

  constructor() { }

  mentionSomeone(user = []) {
    // funktion zur benutzererwähnung
    console.log("erwähnte User:",user)
  }
}
