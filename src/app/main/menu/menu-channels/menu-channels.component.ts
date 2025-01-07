import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Channel } from '../../../models/channel';
import { ChannelsService } from '../../../shared/services/channels.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddchatComponent } from '../../addchat/addchat.component';

@Component({
  selector: 'app-menu-channels',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './menu-channels.component.html',
  styleUrls: ['./menu-channels.component.scss'],
})
export class MenuChannelsComponent implements OnInit, OnDestroy {
  private unsubscribeFn: (() => void) | null = null;
  channelsOpen: boolean = false;
  channelActive: boolean = false;
  channels: Channel[] = [];
  loading: boolean = true;
  channelForm: FormGroup;
  currentChannelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public channelsService: ChannelsService,
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
      this.channels = channels;
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
    this.channelsService.selectChannel(channelId)
  }
}