import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChannelsService } from '../../../shared/services/channels.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Channel } from '../../../models/channel';
import { AuthService } from '../../../shared/services/auth.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { UserModel } from '../../../models/user';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-user-to-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-to-channel.component.html',
  styleUrl: './add-user-to-channel.component.scss'
})
export class AddUserToChannelComponent{
  @Input() active = '';
  @Input() channelName = '';
  @Input() ids:string[] = [];
  @Output() close = new EventEmitter<void>();
  memberIDs: any[] = [];
  members: any[] = [];
  channel: Observable<Channel | null>;
  loading = true;
  userArray:any;
  profileOpen:boolean = false;
  activeMember: {
    name: string,
    email: string,
    status:boolean,
    avatar: string,
  } = {
    name: '',
    email: '',
    status: false,
    avatar: '',
  };


  constructor(
    private channelsService: ChannelsService, 
    private authService: AuthService,
    private firestore: Firestore,
  ) {
    this.channel = this.channelsService.currentChannel$;
    this.members.splice(0);
    this.memberIDs.splice(0);
  }

  ngOnInit(): void {
    console.log(this.ids)
    // debugger;
    this.channel.subscribe((channel) => {
      if (channel) {
        const members = channel.members.map((memberId) => ({
          id: memberId,
        }));
        console.log(members.length)
        for (let i = 0; i < members.length; i++) {
          let meb = members[i].id
          // console.log(meb)
          this.memberIDs.push(meb)
        }
        this.getData();
      }
    });
  }

  async getData() {
    // console.log(this.memberIDs)
    // console.log("Getting Data.............");
    let Uid;
    // for (let i = 0; i < this.memberIDs.length; i++) {
    //   const id = this.memberIDs[i];
    //   Uid = id;

      if (this.members.length <= this.memberIDs.length) {
        for (let i = 0; i < this.memberIDs.length; i++) {
          const id = this.memberIDs[i];
          Uid = id;
          if (Uid) {
            const Ref = doc(this.firestore, `users/${Uid}`);
            const coll = await getDoc(Ref)
            this.userArray = { ...coll.data() } as UserModel;
            // console.log(this.userArray)
            this.members.push(this.userArray)
          } else {
            console.log("User bereits geladen")
          }
        }
      } else {
        console.log("Members Array nich leer?", this.members)
      }
    // }
  }

  addUser(form:NgForm) {
    // console.log(this.members);
  }

  onClose() {
    this.close.emit();
  }

  stopPropagation(event:any) {
    event.stopPropagation();
  }

  openProfile(id: string) {
    console.log("open Profile", id)
    for (let i = 0; i < this.members.length; i++) {
      const element = this.members[i];
      if (element.userId === id) {
        this.activeMember.name = element.name;
        this.activeMember.email = element.email;
        this.activeMember.status = element.status;
        this.activeMember.avatar = element.photoURL;
        console.log("added Member",this.activeMember)
      } else {
        
      }
    }
    this.profileOpen = true;
    // console.log(this.userData)
    console.log(this.members);
  }

  closeProfile() {
    this.profileOpen = false;
  }

  // get userData() {
  //   return this.authService.userData();
  // }
}
