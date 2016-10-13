import { Component } from '@angular/core';
import { NavController, IONIC_DIRECTIVES} from 'ionic-angular';
import {TextImage} from '../../widgets/text-img/text-img';
import {Storage, LocalStorage, Events} from 'ionic-angular';

import { ChatService } from '../../providers/chat-service/chat-service';

import { Query as AVQuery, Object as AVObject, User as AVUser} from 'leancloud-storage';
import { Realtime as AVRealtime, IMClient as AVIMClient } from 'leancloud-realtime';

@Component({
  templateUrl: 'build/pages/conversation-list/conversation-list.html',
  providers: [ChatService],
  directives: [TextImage]
})
export class ConversationListPage {
  leancloud = {
    appId: '3knLr8wGGKUBiXpVAwDnryNT-gzGzoHsz',
    appKey: '3RpBhjoPXJjVWvPnVmPyFExt',
    region: 'cn',
    publicConId: '57fc97f55bbb50005b3a25a9'
  };
  local: Storage;
  items: Array<{
    name: string,
    lastMessage?: { text?: string, receivedAt?: Date, from?: string },
  }>;

  realtime: AVRealtime;
  client: AVIMClient;

  constructor(private navCtrl: NavController,
    public events: Events,
    public chatService: ChatService) {
    this.local = new Storage(LocalStorage);
    this.fetchConversationList();
  }
  show(event) {
    this.fetchConversationList();
  }
  fetchConversationList() {

    let query = new AVQuery('_Conversation');
    query.containedIn('m', [AVUser.current().getUsername()]);
    query.find<AVObject[]>().then(cons => {
      cons.forEach((v, i, a) => {
        let name = v.get('name');
        this.items.push({
          name: name,
        });
      });
    });

    this.realtime = new AVRealtime({ appId: this.leancloud.appId, region: 'cn' });
    return this.realtime.createIMClient(AVUser.current().getUsername()).then(imClient => {
      this.client = imClient;
      return this.client.getQuery().withLastMessagesRefreshed(true).find();
    }).then(cons => {
      this.items = [];
      console.log('cons.length', cons.length);
      cons.forEach((v, i, a) => {
        console.log('name', v.name);
        let name = v.name;
        // let receivedAt = new Date();
        // let from = 'undefined';
        // if (v.lastMessage) {
        //   receivedAt = v.lastMessageAt;
        //   from = v.lastMessage.from;
        // }
        this.items.push({
          name: name
        });
        
      });
    }).catch(error => {
      console.error(JSON.stringify(error));
    });
  }
}
