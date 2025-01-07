import { Component } from '@angular/core';
import {
  ToastMessageService,
  ToastMessage,
} from '../services/toastmessage.service';

@Component({
  selector: 'app-toastmessage',
  templateUrl: './toastmessage.component.html',
  styleUrls: ['./toastmessage.component.scss'],
  standalone: true,
})
export class ToastMessageComponent {
  toastMessage: ToastMessage | null = null;

  constructor(private toastMessageService: ToastMessageService) {
  }

  get toast(){
    return this.toastMessageService.toastSignal();
  }
}
