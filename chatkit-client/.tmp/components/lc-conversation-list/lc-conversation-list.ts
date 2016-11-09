import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OnChanges, ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import AV from 'leancloud-storage';
import { Realtime, IMClient, Message, Conversation, TextMessage } from 'leancloud-realtime';
import moment from 'moment';
import { lcGlobal, SharedService } from '../lc-global';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';

@Component({
  selector: 'lc-conversation-list',
  templateUrl: 'lc-conversation-list.html',
})

export class LCConversationList {
  currentClientId: any;
  zone: NgZone;
  cacheProvider: MessageProvider;
  @Input()
  set clientId(clientId: string) {
    this.currentClientId = clientId;
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
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  initList() {
    let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
    realtime.createIMClient(this.currentClientId).then(imClient => {
      //this.avIMClient = imClient;
      SharedService.client = imClient;
      SharedService.client.on('message', (message: Message, conversation: Conversation) => {
        let eventName: string = 'lc:received:' + conversation.id;
        // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
        if (lcGlobal.realtime_config.localCache) {
          this.cacheProvider.getProvider(this.currentClientId).push(message, conversation);
        }
        console.log('Message received: ', message.id, message.type, JSON.stringify(message), eventName);
        this.updateLastMessage(message);
        this.events.publish(eventName, message);
      });

      return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
    }).then(cons => {
      this.zone.run(() => {
        cons.forEach((v, i, a) => {
          let text = '';
          if (v.lastMessage instanceof TextMessage) {
            text = v.lastMessage.getText();
          } else {
            text = '';
          }
          this.items.push({
            id: v.id,
            name: v.name,
            lastMessage: { from: v.lastMessage.from, text: text }
          });
        });
      });
    });
  }

  onConversationItemClick(conv) {
    this.convClicked.emit({ id: conv.id, name: conv.name });
  }

  send(sendEventData) {
    let convIdStr: string = sendEventData.id;
    SharedService.client.getConversation(convIdStr, true).then(conv => {
      let txtMessage = new TextMessage(sendEventData.text);
      console.log(JSON.stringify(this.items));
      console.log('send(sendEventData)');
      return conv.send(txtMessage);
    }).then(message => {
      this.updateLastMessage(message);
      this.events.publish('lc:sent:' + convIdStr, message);
    }).catch(reason => {
      console.log('error:', reason.stack);
    });
  }
  
  getMessageHistroyFromServer(convId, pIndex, pSize) {
    let convIdStr: string = convId;
    SharedService.client.getConversation(convIdStr, true).then(conv => {
    });
  }

  updateLastMessage(message) {
    this.zone.run(() => {
      let text = '';
      if (message instanceof TextMessage) {
        text = message.getText();
      } else {
        text = '';
      }
      this.items.filter(conv => {
        return conv.id == message.cid;
      }).forEach((v, i, a) => {
        v.lastMessage.from = message.from;
        v.lastMessage.text = text;
      });
    });
  }
}
