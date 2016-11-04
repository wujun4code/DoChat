import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnChanges, ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import AV from 'leancloud-storage';
import { Realtime, IMClient, Message, Conversation, TextMessage } from 'leancloud-realtime';
import moment from 'moment';
import { lcGlobal, SharedService } from '../lc-global';
import { MessageProvider } from '../cache/MessageProvider';

@Component({
  selector: 'lc-conversation-list',
  templateUrl: 'lc-conversation-list.html',
})

export class LCConversationList {
  currentClientId: any;
  avIMClient: IMClient;
  cacheProvider: MessageProvider;
  @Input()
  set clientId(clientId: string) {
    this.currentClientId = clientId;
    console.log(JSON.stringify(this.currentClientId));
    this.cacheProvider = new MessageProvider();
    this.initList();
  }
  @Output() convClicked = new EventEmitter<{ id: string, name: string }>();
  //currentClient: AVIMClient;
  items: Array<{
    id: string,
    name: string,
    lastMessage?: { text?: string, receivedAt?: Date, from?: string }
  }>;
  constructor(private ref: ChangeDetectorRef,
    public events: Events) {
    this.items = [];
    this.events.subscribe('lc:send', (sendEventData) => {
      this.send(sendEventData[0]);
    });
  }

  initList() {
    // AV.init({
    //   appId: lcGlobal.leancloud.appId,
    //   appKey: lcGlobal.leancloud.appKey
    // });
    let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
    realtime.createIMClient(this.currentClientId).then(imClient => {
      this.avIMClient = imClient;
      // initClient(imClient);
      // on message received
      SharedService.client = imClient;
      imClient.on('message', (message: Message, conversation: Conversation) => {
        let eventName: string = 'lc:received:' + conversation.id;
        // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
        if (lcGlobal.realtime_config.localCache) {
          this.cacheProvider.getProvider(this.currentClientId).push(message, conversation);
        }
        console.log('Message received: ', message.id, message.type, JSON.stringify(message), eventName);
        this.events.publish(eventName, message);
      });

      return imClient.getQuery().withLastMessagesRefreshed(true).find();
    }).then(cons => {
      cons.forEach((v, i, a) => {
        this.items.push({
          id: v.id,
          name: v.name
        });
      });
      // fix promise won't refresh the UI
      this.ref.detectChanges();
    });
  }

  onConversationItemClick(conv) {
    this.convClicked.emit({ id: conv.id, name: conv.name });
  }
  send(sendEventData) {
    let convIdStr: string = sendEventData.id;
    this.avIMClient.getConversation(convIdStr, true).then(conv => {
      return conv.send(new TextMessage(sendEventData.text));
    }).then(message => {
      console.log(JSON.stringify(message));
      this.events.publish('lc:sent:' + convIdStr, message);
    }).catch(reason => {
      console.log('error:', reason.stack);
    });
  }
  getMessageHistroyFromServer(convId, pIndex, pSize) {
    let convIdStr: string = convId;
    this.avIMClient.getConversation(convIdStr, true).then(conv => {
    });
  }
}
