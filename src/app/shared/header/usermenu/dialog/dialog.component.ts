import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserDialogService } from '../../../services/user-dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true, // <-- Add this line
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  @Output() dialogChange = new EventEmitter<boolean>();
  @Input() mobileDialog = false;

  constructor(
    public userDialog$: UserDialogService,
  ) {
    this.userDialog$.dataChangeAllowedCheck();
  }
  
  ngOnInit() {
    
  }

  onOpenMobileProfile(){
    this.userDialog$.openProfile();
    // this.mobileDialog = !this.mobileDialog;
  }
}
