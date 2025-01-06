import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profileview',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './profileview.component.html',
  styleUrl: './profileview.component.scss'
})
export class ProfileviewComponent {
  @Input() member:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileviewComponent>,
  ) {
    this.member = data.member;
  }

  closeProfile() {
    this.dialogRef.close(); 
  }

  sendMessage() {
    console.log(this.member);
  }
}
