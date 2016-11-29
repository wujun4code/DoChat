import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
import { SharedService } from '../lc-global';
@Component({
  selector: 'do-contact-detail',
  templateUrl: 'do-contact-detail.html'
})
export class DoContactDetail {

  @Input('clientId')
  clientId: string;
  avatar: string = '';
  markName: string = '';
  nickName: string = '';
  isStared: boolean = false;
  location: string = '';
  constructor(public dataService: DoDataService) {
  }
  ngOnInit() {
    this.dataService.getFriendById(SharedService.clientId,this.clientId).then(friend => {
      this.avatar = friend.avatar;
      this.clientId = friend.clientId;
      this.nickName = friend.nickName;
      this.markName = friend.markName;
      this.isStared = friend.isStard;
      this.location = friend.location;
    });
  }
  @Output() clickNavToChat = new EventEmitter<{
    clientId?: string,
    markName?: string
  }>();
  navToSetTags(event) {

  }
  navToChat(event) {
    this.clickNavToChat.emit({
      clientId: this.clientId,
      markName: this.markName.length > 0 ? this.markName : this.nickName,
    });
  }
}
