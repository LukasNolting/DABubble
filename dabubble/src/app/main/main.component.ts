import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { BuilderComponent } from '../shared/builder/builder.component';
import { ToastMessageService } from '../shared/services/toastmessage.service';
import { ToastMessageComponent } from '../shared/toastmessage/toastmessage.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    BuilderComponent,
    ToastMessageComponent,
    CommonModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    private toastMessageService: ToastMessageService,
    private auth: AuthService
  ) {}
  authService = inject(AuthService);
  loadingStatus = this.authService.loadingSpinnerBoard;

  get toastMessage() {
    return this.toastMessageService.toastSignal();
  }

  ngOnInit(): void {
    this.clearLoadingSpinner();
  }

  clearLoadingSpinner() {
    setTimeout(() => {
      this.loadingStatus = false;
    }, 1500);
  }
}
