import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Camera, CameraPopoverOptions, CameraOptions} from 'ionic-native';

import {UserProvider} from '../../providers/user/user';

import {Cloud as AVCloud, User as AVUser} from 'leancloud-storage';

@Component({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [UserProvider]
})
export class SignupPage {

  constructor(private navCtrl: NavController,
    public events: Events,
    private userProvider: UserProvider) {
    this.signup = {
      avatar: 'img/appicon.svg',
      showShortCodeBox: false,
      showPasswordBox: false,
      sending: false,
      actionText: '发送验证码',
      ticks: 60,
    };
    this.signup.showShortCodeBox = true;
    this.signup.showPasswordBox = true;
  }
  signup: {
    avatar?: string,
    nickName?: string,
    ticks?: number,
    mobile?: string,
    shortcode?: number,
    showShortCodeBox?: boolean,
    password?: string,
    showPasswordBox?: boolean,
    actionText?: string,
    sending?: boolean
  };

  avatarPick(event) {
    console.log('avatar pick');
    let options: CameraOptions = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };
    Camera.getPicture(options).then(imageData => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.signup.avatar = imageData;
    }, (err) => {
      // Handle error
    });
  }

  sendShortCode(event) {
    console.log(this.signup.mobile);
    AVCloud.requestSmsCode(this.signup.mobile).then(data => {
      this.signup.sending = true;
      this.signup.showShortCodeBox = true;
      this.signup.showPasswordBox = true;
      let timerId = setInterval(() => {
        this.signup.ticks -= 1;
        this.signup.actionText = this.signup.ticks + "秒后重新获取";
      }, 1000);
      setTimeout(() => {
        this.signup.sending = false;
        this.signup.actionText = "发送验证码";
        clearInterval(timerId);
      }, 60000);
    }, error => {
      console.log(JSON.stringify(error));
    });
  }
  signupNow(event) {
    AVUser.signUpOrlogInWithMobilePhone<AVUser>(this.signup.mobile, this.signup.shortcode.toString(), { password: this.signup.password }).then(user => {
      this.userProvider.save(user).then(success => {
        this.events.publish('user:login', user);
      });
      console.log(JSON.stringify(user));
    }, error => {
      console.log(JSON.stringify(error));
      // 如果手机号已经注册，提示用户回到登录页面
      // 如果验证码输入错误，需要提示
    });
  }
}
