import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  error: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  toastSignal = signal<string>('');

  showToast(error: boolean, message: string) {
    this.toastSubject.next({ error, message });
  }

  showToastSignal(message: string) {
    this.toastSignal.set(message);
    setTimeout(() => {
      this.toastSignal.set('');
    }, 2500);
  }
}
