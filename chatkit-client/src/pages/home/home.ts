import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ChatPage } from '../../pages/chat/chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  clientId: string;
  constructor(public navCtrl: NavController) {
    this.clientId = 'dev';
  }
  ionViewDidLoad() {
    console.log('home ionViewDidLoad');
  }
  //con: {"id":"57fdb59cfab00f41dd84ed7e","name":"conversation name"}
  navToChat(con) {
    console.log('navToChat clicked.', JSON.stringify(con));
    this.navCtrl.push(ChatPage, { id: con.id, name: con.name, conv: con.metaData });
  }
}
