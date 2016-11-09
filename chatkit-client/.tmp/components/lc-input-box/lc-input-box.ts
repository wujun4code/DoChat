import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'lc-input-box',
  templateUrl: 'lc-input-box.html'
})
export class LCInputBox {
  conversationId: string;
  text: string;
  @Input()
  set convId(convId: string) {
    this.conversationId = convId;
  }
  constructor(public events: Events) {
  }
  send() {
    this.events.publish('lc:send',{
      id: this.conversationId,
      text: this.text
    });
    this.text = '';
  }
}
