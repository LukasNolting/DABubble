import { Component } from '@angular/core';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuChannelsComponent } from './menu-channels/menu-channels.component';
import { MenuPrivateMessagesComponent } from './menu-private-messages/menu-private-messages.component';

@Component({
  selector: 'app-menu',
  standalone: true,   // <-- Add this line
  imports: [MenuHeaderComponent, MenuChannelsComponent, MenuPrivateMessagesComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
