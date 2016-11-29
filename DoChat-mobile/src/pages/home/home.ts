import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { ChatPage } from '../../pages/chat/chat';
import { SharedService } from '../../components/lc-global';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  clientId: string;
  title: string;
  constructor(public navCtrl: NavController, public events: Events) {
    this.clientId = SharedService.clientId;
    this.title = SharedService.getNoticText();
    this.events.subscribe('messageBadge', () => {
      let noticeText = SharedService.getNoticText();
      this.title = noticeText;
    });
  }
  ionViewDidLoad() {
    console.log('home ionViewDidLoad');
  }
  //con: {"id":"57fdb59cfab00f41dd84ed7e","name":"conversation name"}
  navToChat(con) {
    console.log('navToChat clicked.', JSON.stringify(con));
    this.navCtrl.push(ChatPage, { id: con.id, name: con.name, conv: con.metaData });
  }
  ionViewWillEnter() {
  }
}
