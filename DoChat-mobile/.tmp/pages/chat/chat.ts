import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ViewController } from 'ionic-angular';
import { SharedService } from '../../components/lc-global';
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  convName: string;
  convId: string;
  friendId: string;
  friendIds: string[];
  constructor(public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController) {
    this.convId = this.params.get('id') || '';
    this.convName = this.params.get('name') || '';
    this.friendId = this.params.get('friendId') || '';
    this.friendIds = this.params.get('friendIds') || [];
    if (this.friendIds.length == 0 && this.friendId.length > 0) {
      this.friendIds = [this.friendId];
    }
  }
  ionViewDidLoad() {
    let noticeText = SharedService.getNoticText();
    console.log('noticeText', noticeText);
    this.viewCtrl.setBackButtonText(noticeText);
  }
  onMessage(message) {
  }
}
