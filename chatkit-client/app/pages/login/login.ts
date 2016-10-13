import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { UserProvider } from '../../providers/user/user';

import { Cloud as AVCloud, User as AVUser } from 'leancloud-storage';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [UserProvider]
})
export class LoginPage {
  login: { mobile?: string, password?: string } = {};
  submitted = false;
  constructor(private navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    private userProvider: UserProvider) {

  }

  more() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '切换账号',
          role: 'destructive',
          handler: () => {
            console.log('切换账号');
          }
        }, {
          text: '注册',
          handler: () => {
            this.navCtrl.push(SignupPage);
            console.log('注册');
          }
        }, {
          text: '前往安全中心',
          handler: () => {
            console.log('前往安全中心');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('取消');
          }
        }
      ]
    });
    actionSheet.present();
  }

  onLogin(form) {
    this.submitted = true;
    if (form.valid) {
      AVUser.logInWithMobilePhone<AVUser>(this.login.mobile, this.login.password).then(user => {
        this.userProvider.save(user).then(success => {
          this.events.publish('user:login', user);
        });
      }, error => {
        console.log(JSON.stringify(error));
      });
    }
  }

}
