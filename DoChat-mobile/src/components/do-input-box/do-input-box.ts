import { Component, Input } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import { DoChatService } from '../../providers/chat-service';
import { Conversation, TextMessage } from 'leancloud-realtime';
@Component({
  selector: 'do-input-box',
  templateUrl: 'do-input-box.html'
})
export class DoInputBox {
  text: string;
  image: string;
  audio: string;
  video: string;

  @Input() conv: Conversation;
  constructor(public events: Events,
    public chatService: DoChatService,
    public viewCtrl: ViewController) {
    this.viewCtrl.willLeave.subscribe(this.willLeave);
  }
  send() {
    let textMessage = new TextMessage(this.text);
    this.chatService.sendMessage(this.conv, textMessage);
    // this.events.publish('lc:send', {
    //   id: this.conversationId,
    //   text: this.text
    // });
    this.text = '';
  }
  onKeyup(event) {
    console.log('onKeyup', event.keyCode, event.target.value);
  }
  onKeypress(event) {
    if (event.keyCode == 13) {
      this.send();
      this.chatService.sendOperationMessage(this.conv, 'pause');
    }

    //console.log('onKeypress', event.keyCode, event.target.value);
  }
  onChange(event) {
    if (event.target.value.length == 1) {
      this.chatService.sendOperationMessage(this.conv, 'typing');
    }
    if (event.target.value.length % 5 == 0) {
      this.chatService.sendOperationMessage(this.conv, 'typing');
    }
    //console.log('onChange', event.keyCode, event.target.value);
  }
  onFocuse(event) {
    this.chatService.sendOperationMessage(this.conv, 'typing');
    //console.log('onFocuse', event.keyCode, event.target.value);
  }
  onBlur(event) {
    this.chatService.sendOperationMessage(this.conv, 'pause');
    //console.log('onBlur', event.keyCode, event.target.value);
  }
  willLeave() {
    //this.chatService.sendOperationMessage(this.conv, 'pause');
  }
}
