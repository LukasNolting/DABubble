import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private sharedVariable = new BehaviorSubject<string>('Initial Value');
  sharedVariable$ = this.sharedVariable.asObservable();

  updateVariable(newValue: string) {
    this.sharedVariable.next(newValue);
  }
}