import { Component, Input } from '@angular/core';
import { ChannelsService } from '../../../shared/services/channels.service';
import { Channel } from '../../../models/channel';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { MenuDialogComponent } from "../../../shared/menu-dialog/menu-dialog.component";
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-mainchat-header',
  imports: [CommonModule, MenuDialogComponent],
  standalone: true,
  templateUrl: './mainchat-header.component.html',
  styleUrl: './mainchat-header.component.scss'
})


export class MainchatHeaderComponent {
  avatarCache = new Map<string, string>();
  avatarsLoaded = false;
  memberAvatars: { [key: string]: string } = {};
  channelTitle: string = '';
  channel: Observable<Channel | null>;
  channelMembers: { id: string; photoURL: string }[] = [];
  loading = true;
  menuDialog: boolean = false;
  membersDialog: boolean = false;
  channelDialog: boolean = false;
  dialogData: any = null;


  constructor(private channelsService: ChannelsService, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.channel = this.channelsService.currentChannel$;  
  }


  ngOnInit(): void {
    this.channel.subscribe((channel) => {
      if (channel) {
        this.channelTitle = channel.name;
        const members = channel.members.map((memberId) => ({
          id: memberId,
          photoURL: this.authService.avatarCache.get(memberId),
        }));
        this.loadMemberAvatars(members).then((memberAvatars) => {
          this.channelMembers = memberAvatars;
          this.loading = false;
        });
      }
    });
  }


  private async loadMemberAvatars(members: { id: string; photoURL?: string }[]): Promise<{ id: string; photoURL: string }[]> {
    const memberAvatars: { id: string; photoURL: string }[] = [];
    for (const member of members) {
      let avatarUrl = member.photoURL || this.avatarCache.get(member.id);
      if (!avatarUrl) {
        avatarUrl = await this.authService.getCachedAvatar(member.id);
        this.avatarCache.set(member.id, avatarUrl);
      }
      memberAvatars.push({ id: member.id, photoURL: avatarUrl });
    }
    return memberAvatars;
  }


  onDialogSwitch(event: { from: string; to: string }) {
    this.closeAllDialogs();
    this.cdr.detectChanges();
    if (event.to === 'menuDialog') {
      this.menuDialog = true;
    } else if (event.to === 'membersDialog') {
      this.membersDialog = true;
    } else if (event.to === 'channelDialog') {
      this.channelDialog = true;
    }
  
    console.log(`Dialog switched: from ${event.from} to ${event.to}`);
  }


  currentChannel() {
    return this.channelsService.currentChannel$;
  }


  loadMessageAvatars(messages: { createdBy: string; photoURL?: string }[]): void {
    for (const message of messages) {
      if (!message.photoURL) {
        this.authService.getCachedAvatar(message.createdBy).then((avatarUrl) => {
          message.photoURL = avatarUrl;
        });
      }
    }
  }


  openDialog(menu: string) {
    this.closeAllDialogs();
    this.dialogData = { name: this.channelTitle, members: this.channelMembers };
    if (menu === 'membersDialog') {
      console.log(this.dialogData.members);
      this.membersDialog = true;
    } else if (menu === 'menuDialog') {
      this.menuDialog = true;
    } else if (menu === 'channelDialog') {
      this.channelDialog = true;
    }
    this.cdr.detectChanges();
  }


  closeAllDialogs() {
    this.menuDialog = false;
    this.membersDialog = false;
    this.channelDialog = false;
  }


  onDialogChange(newValue: boolean, menu: string) {
    this.closeAllDialogs();
    if (menu === 'membersDialog') 
      this.membersDialog = newValue;
    else if (menu === 'menuDialog')
      this.menuDialog = newValue;
    else if (menu === 'channelDialog') 
      this.channelDialog = newValue;
  }


  closeDialog(event: Event) {
    event?.preventDefault();
    event.stopPropagation();
    this.menuDialog = false;
    this.membersDialog = false;
    this.channelDialog = false;
  }


  get userData() {
    return this.authService.userData();
  }
}
