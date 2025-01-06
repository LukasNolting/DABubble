import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileviewComponent } from '../profileview/profileview.component';



@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss'
})


export class MenuDialogComponent  implements OnInit {
  @Input() menuDialog: boolean = false;
  @Input() membersDialog: boolean = false;
  @Input() channelDialog: boolean = false;
  @Input() dialogData: { name: string; members: any[] } = { name: '', members: [] };
  @Output() dialogSwitch = new EventEmitter<{ from: string; to: string }>();
  memberIds: string[] = [];
  memberNames: { name: string; userId: string; photoURL: string }[] = [];
  addMembersForm!: FormGroup;
  activeMember: any = {};

  constructor(private fb: FormBuilder, public authService: AuthService, private dialog: MatDialog,) {}
  async ngOnInit(): Promise<void> {
    this.memberIds = this.dialogData.members.map((member) => member.id);
    this.memberNames = await this.authService.getUsernamesByIds(this.memberIds);
    this.addMembersForm = this.fb.group({
      members: ['', Validators.required],
    });
  }


  closeDialog(event: Event, menu: string) {
    event?.preventDefault();
    event?.stopPropagation();
    this.dialogSwitch.emit({ from: menu, to: 'none' }); // Signalisiere Parent-Komponente, dass der Dialog geschlossen werden soll
  }


  switchDialog(to: string) {
    console.log(to);
    if (this.menuDialog) {
      this.dialogSwitch.emit({ from: 'menuDialog', to });
    } else if (this.membersDialog) {
      this.dialogSwitch.emit({ from: 'membersDialog', to });
    } else if (this.channelDialog) {
      this.dialogSwitch.emit({ from: 'channelDialog', to });
    }
  }


  getUserData(id: string) {
    return this.authService.getUserById(id);
  }


  dontCloseDialog(event: Event) {
    event?.preventDefault();
    event.stopPropagation();
  }


  selectMember(member: any) {
    this.activeMember = member
  }


  get userData() {
    return this.authService.userData();
  }


  addMembers(){
    console.log(this.addMembersForm);
  }

  openDialog(): void {
    this.dialog.open(ProfileviewComponent, {
      width: 'fit-content',
      maxWidth: '100vw',
      height: 'fit-content',
      data: {member: this.activeMember}
    });
  }
}
