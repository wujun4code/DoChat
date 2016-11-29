import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContactDetailPage } from '../contact-detail/contact-detail';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }
  onFriendTapped(event){
    this.navCtrl.push(ContactDetailPage,{friendId:event.clientId});
  }
}
