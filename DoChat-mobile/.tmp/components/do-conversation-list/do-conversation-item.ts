import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
/*
  Generated class for the LCContactListItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'do-conversation-item',
  templateUrl: 'do-conversation-item.html'
})
export class DoConversationItem {
  hasImage: boolean;
  hasLastMessage: boolean;
  conv: DoConversation;
  // @Input()
  // badge: number;
  @Input()
  set convItem(convItem: DoConversation) {
    this.conv = convItem;
    let imgChecker = this.conv.titleImg || '';
    this.hasImage = imgChecker.length > 0;
    if (this.conv.lastMessage) {
      this.hasLastMessage = true;
    }
  }
  constructor(public events: Events) {
    // this.events.subscribe('messageBadge', (data) => {
    //   console.log('messageBadge', this.conv.unreadBadge);
    // });
  }
  @Output() convItemClicked = new EventEmitter<{ id: string, name: string }>();
  onConversationItemClick(item) {
    this.convItemClicked.emit({ id: this.conv.id, name: this.conv.name });
  }
  ngOnInit() {
  }
}

export class DoConversation {
  id: string;
  name: string;
  lastMessage?: { text?: string, receivedAt?: Date, from?: string };
  unreadBadge?: number;
  lastOpenedAt?: Date;
  updatedAt?: Date;
  titleImg?: string;
  pattern?: number;
}

