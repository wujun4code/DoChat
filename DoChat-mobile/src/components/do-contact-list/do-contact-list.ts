import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
import { SharedService } from '../lc-global';
@Component({
  selector: 'do-contact-list',
  templateUrl: 'do-contact-list.html'
})
export class DoContactList implements OnInit {
  staredFriends: Array<{
    name?: string,
    clientId?: string,
    avatar?: string,
  }>;
  friends: Array<{
    name?: string,
    clientId?: string,
    avatar?: string,
  }>;
  ngOnInit() {

  }
  constructor(public dataService: DoDataService) {
    this.staredFriends = [];
    this.friends = [];
    
    this.dataService.getFriends(SharedService.clientId, true).then(friends => {
      friends.forEach((v, i, a) => {
        if (v.isStard) {
          this.staredFriends.push({
            name: v.markName.length > 0 ? v.markName : v.nickName,
            clientId: v.clientId,
            avatar: v.avatar
          });
        } else {
          this.friends.push({
            name: v.markName.length > 0 ? v.markName : v.nickName,
            clientId: v.clientId,
            avatar: v.avatar
          });
        }
      });
    });
  }
  @Output() onFriendClicked = new EventEmitter<{
    name?: string,
    clientId?: string,
    avatar?: string
  }>();

  onContactItemClick(friend) {
    this.onFriendClicked.emit({
      name: friend.name,
      clientId: friend.clientId,
      avatar: friend.avatar
    });
  }
  popupSearchFriend(event) {

  }
  popupGroupChat(event) {

  }
  popupEditTag(event) {

  }
  popupOfficialAccounts(event) {

  }
}
