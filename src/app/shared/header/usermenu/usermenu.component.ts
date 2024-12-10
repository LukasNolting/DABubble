import { Component } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usermenu',
  imports: [DialogComponent, CommonModule],
  templateUrl: './usermenu.component.html',
  styleUrl: './usermenu.component.scss',
})
export class UsermenuComponent {
  dialog: boolean = false;
  openDialog(event: Event) {
    this.dialog = true;
  }

  onDialogChange(newValue: boolean) {
    this.dialog = newValue;
  }

  closeDialog(event: Event) {
    event?.preventDefault();
    event.stopPropagation();
    this.dialog = false;
  }
}

