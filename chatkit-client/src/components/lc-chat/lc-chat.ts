import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { OnChanges, ChangeDetectorRef } from '@angular/core';
import { Realtime, IMClient, Message, Conversation, TextMessage } from 'leancloud-realtime';
import { Events, List } from 'ionic-angular';
import { lcGlobal, SharedService } from '../lc-global';

@Component({
  selector: 'lc-chat',
  templateUrl: 'lc-chat.html'
})
export class LCChat {
  conversationId: string;
  conversationName: string;
  msgsInConv: Array<{
    avatar?: string,
    text?: string,
    image?: string,
    fromMe?: boolean,
  }>;
  messageIterator: any;
  // currentClient: IMClient;
  // @Input()
  // set client(client: IMClient) {
  //   this.currentClient = client;
  // }
  @Input()
  set convId(convId: string) {
    this.conversationId = convId;

    let eventName = 'lc:received:' + this.conversationId;
    console.log('set convId', eventName);

    if (lcGlobal.realtime_config.localCache) {

    } else {
      SharedService.client.getConversation(this.conversationId).then(conv => {
        this.messageIterator = conv.createMessagesIterator({ limit: 20 });
        this.messageIterator.next().then(result => {
          console.dir(result);
          result.value.forEach((v, i, a) => {
            let text = '';
            if (v instanceof TextMessage) {
              text = v.getText();
            }
            let fromMe = v.from == SharedService.client.id;
            this.msgsInConv.push({
              avatar: 'assets/img/thumbnail-kitten-2.jpg',
              text: text,
              fromMe: fromMe
            });
          });
        });
      });
    }

    this.events.subscribe('lc:received:' + this.conversationId, data => {
      let message = data[0];

      console.log('received message', message);
      this.msgsInConv.push({
        avatar: 'assets/img/thumbnail-kitten-2.jpg',
        text: message._lctext,
        fromMe: false
      });
      this.ref.detectChanges();
      this.onMsg.emit(message);
    });

    this.events.subscribe('lc:sent:' + this.conversationId, data => {
      let message = data[0];
      console.log('sent message', JSON.stringify(message));
      this.msgsInConv.push({
        avatar: 'assets/img/thumbnail-kitten-2.jpg',
        text: message._lctext,
        fromMe: true
      });
      this.ref.detectChanges();
      this.onMsg.emit(message);
    });
  }
  @Input()
  set convName(convName: string) {
    this.conversationName = convName;
    console.log('this.conversationName', this.conversationName);
  }
  @Output() onMsg = new EventEmitter<any>();
  constructor(public events: Events, private ref: ChangeDetectorRef) {
    this.msgsInConv = [];

    // for (let i = 0; i < 10; i++) {
    //   this.msgsInConv.push({
    //     avatar: 'assets/img/thumbnail-kitten-2.jpg',
    //     text: i + "魏迟是猴子么？",
    //     fromMe: i % 2 == 0,
    //   });
    // }
  }
}