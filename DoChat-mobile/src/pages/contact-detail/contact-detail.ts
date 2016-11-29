import { Component, EventEmitter } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ChatPage } from '../../pages/chat/chat';
import { lcGlobal, SharedService } from '../../components/lc-global';
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html'
})
export class ContactDetailPage {
  friendId: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events) {

    this.friendId = this.navParams.get('friendId');
    console.log('ContactDetailPage.friendId', this.friendId);
  }

  ionViewDidLoad() {
  }
  navToChatPage(event) {
    let targetClientId = event.clientId;
    let targetMarkName = event.markName;
    // SharedService.client.createConversation({
    //   members: [targetClientId],
    //   unique: true,
    //   transient: false,
    //   markedName: [SharedService.clientId, targetMarkName],
    //   type: 'private'
    // }).then(conv => {
    //   this.events.publish('lc_conv_opened', conv);
    //   this.navCtrl.push(ChatPage, { id: conv.id, name: targetMarkName });
    // }).catch(error => {
    //   console.log(error.stack)
    // });
    this.navCtrl.push(ChatPage, { name: targetMarkName, friendId: targetClientId });
  }

}
