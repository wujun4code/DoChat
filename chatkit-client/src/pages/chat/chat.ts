import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Realtime, IMClient, Message, Conversation } from 'leancloud-realtime';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  convName: string;
  convId: string;
  @ViewChild(Content) chatContent: Content;
  constructor(public navCtrl: NavController,
    public params: NavParams) {
    this.convId = this.params.get('id');
    this.convName = this.params.get('name');
  }
  ionViewDidLoad() {
    let ticks = 2;
    let timerId = setInterval(() => {
      console.log('this.chatContent.scrollToBottom(200)');
      this.chatContent.scrollToBottom();//200ms animation speed
      ticks--;
      if (ticks == 0) {
        clearInterval(timerId);
      }
    }, 500);

    setTimeout(() => {
      this.chatContent.scrollToBottom();
      //clearInterval(timerId);
    });
  }
  onMessage(message) {
    console.log('parent page', JSON.stringify(message));
    this.chatContent.scrollToBottom();
  }
}
