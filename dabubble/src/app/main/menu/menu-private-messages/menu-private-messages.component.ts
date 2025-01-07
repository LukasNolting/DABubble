import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddchatComponent } from '../../addchat/addchat.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelsService } from '../../../shared/services/channels.service';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../../../models/channel';
import { SharedService } from '../../../shared/services/newmessage.service';

@Component({
  selector: 'app-menu-private-messages',
  standalone: true,   // <-- Add this line
  imports: [CommonModule],
  templateUrl: './menu-private-messages.component.html',
  styleUrl: './menu-private-messages.component.scss'
})
export class MenuPrivateMessagesComponent {
  messagesOpen: boolean = false

  private unsubscribeFn: (() => void) | null = null;
  privateChannels: Channel[] = [];
  loading: boolean = true;
  channelForm: FormGroup;
  currentChannelId: string | null = null;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public channelsService: ChannelsService,
    private sharedService: SharedService,
    ) {
      this.channelForm = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        isPrivate: [false],
      });
    }


    ngOnInit(): void {
      this.loadChannelsRealtime();
    }


    ngOnDestroy(): void {
      if (this.unsubscribeFn) {
        this.unsubscribeFn();
      }
    }


    loadChannelsRealtime(): void {
      this.loading = true;
      this.unsubscribeFn = this.channelsService.loadChannelsRealtime((channels) => {
        this.privateChannels = channels;
        this.loading = false;
      });
    }


    async addChannel(): Promise<void> {
      console.error('addChannel() wurde nicht implementiert.');
    }


    openDialog(): void {
      this.dialog.open(AddchatComponent, {
        width: 'fit-content',
        maxWidth: '100vw',
        height: 'fit-content',
      });
    }
  

    selectChannel(channelId: string): void {
      // neue nachricht uU ausblenden
      this.sharedService.updateVariable('false');

      this.channelsService.selectChannel(channelId)
    }


  toggleMessagesOpen(): void {
    this.messagesOpen = !this.messagesOpen
  }

  getAvatar(privateChannel: Channel): string {
    // return this.channelsService.getAvatar(privateChannel);
    return '/img/avatars/avatar1.svg';
  }

}
