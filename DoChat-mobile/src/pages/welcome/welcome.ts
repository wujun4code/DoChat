import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class Welcome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Welcome Page');
  }

}
