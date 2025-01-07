import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastMessageService } from '../../../services/toastmessage.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserModel } from '../../../../models/user';

@Component({
  selector: 'app-dialog',
  standalone: true, // <-- Add this line
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() dialog: boolean = false;
  @Output() dialogChange = new EventEmitter<boolean>();
  profileDialog: boolean = false;
  profileDialogEdit: boolean = false;
  authService = inject(AuthService);
  profileDataChanged = signal<boolean>(false);
  profileForm;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastMessageService: ToastMessageService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      userInputName: [
        this.userData?.name,
        [
          Validators.required,
          //Validators.pattern('^[a-zA-ZÀ-ÿ]{1,}(?: [a-zA-ZÀ-ÿ]{1,})+$'),
          //Validators.pattern('^[a-zA-ZÀ-ÿ]{1,}(?:[-' ][a-zA-ZÀ-ÿ]{1,})*$')
          Validators.pattern('^[a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)?(?: [a-zA-ZÀ-ÿ]+(?:-[a-zA-ZÀ-ÿ]+)?)$')
        ],
      ],
      userInputEmail: [
        this.userData?.email,
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.dataChangeAllowedCheck();
  }

  dontCloseDialog(event: Event) {
    event?.preventDefault();
    event.stopPropagation();
  }

  logout() {
    localStorage.removeItem('token');
    this.auth.logout();
  }

  openProfile() {
    this.profileDialog = true;
    this.dialog = false;
  }

  openProfileEdit() {
    this.profileDialog = false;
    this.profileDialogEdit = true;
    this.profileForm.reset({
      userInputName: this.userData?.name,
      userInputEmail: this.userData?.email,
    });
  }

  dataChangeAllowedCheck() {
    if (this.userData?.provider !== 'password') {
      this.profileForm.disable();
    }
  }

  closeProfileEdit() {
    this.profileDialog = true;
    this.profileDialogEdit = false;
  }

  closeDialog(event: Event) {
    this.profileDialog = false;
    this.profileDialogEdit = false;
    this.dialogChange.emit(this.dialog);
  }

  // saveProfile() {
  //   this.profileDialog = false;
  //   this.profileDialogEdit = false;
  //   this.dialogChange.emit(this.dialog);
  //   this.toastMessageService.showToastSignal('Profil erfolgreich aktualisiert');
  // }

  async saveProfile(): Promise<void> {
    if (this.profileForm.valid && this.userData) {
      const updatedData: Partial<UserModel> = {
        name: this.profileForm.value.userInputName ?? '',
        email: this.profileForm.value.userInputEmail ?? undefined,
      };

      try {
        await this.authService.updateUserData(this.userData.userId, updatedData);
        this.profileDialog = false;
        this.profileDialogEdit = false;
        this.dialogChange.emit(this.dialog);
        this.toastMessageService.showToastSignal(
          'Profil erfolgreich aktualisiert'
        );
      } catch (error) {
        console.error('Fehler beim Speichern der Profiländerungen:', error);
      }
    }
  }

  get userData() {
    return this.authService.userData();
  }

  profileDataChange() {
    if (
      (this.userData?.name ?? '') !=
      (this.profileForm.get('userInputName')?.value ?? '') ||
      (this.userData?.email ?? '') !=
      (this.profileForm.get('userInputEmail')?.value ?? '')
    ) {
      this.profileDataChanged.set(true);
      console.log('Profile data changed');
    } else {
      this.profileDataChanged.set(false);
    }
  }
}
