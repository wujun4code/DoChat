import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SharedService } from '../../components/lc-global';
import { DoDataService } from '../../providers/data-service';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  clientId: string;
  constructor(public navCtrl: NavController,
    public dataService: DoDataService) {

  }
  goHome(event) {
    console.log('clientId', this.clientId);
    SharedService.clientId = this.clientId;
    this.navCtrl.setRoot(TabsPage, { clientId: this.clientId });
    this.dataService.createMessageTable(this.clientId);
  }
  onKeypress(event) {
    if (event.keyCode == 13) {
      this.goHome(event);
    }
  }
  ionViewDidLoad() {
    console.log('Hello Login Page');
  }
}
