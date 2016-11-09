import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { lcGlobal, SharedService } from '../../components/lc-global';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  clientId: string;
  constructor(public navCtrl: NavController) {

  }
  goHome(event) {
    console.log('clientId',this.clientId);
    SharedService.clientId = this.clientId;
    this.navCtrl.setRoot(TabsPage, { clientId: this.clientId });
  }
  ionViewDidLoad() {
    console.log('Hello Login Page');
  }
}
