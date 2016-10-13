import { Component, ViewChild } from '@angular/core';
import { Events, ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { UserProvider } from './providers/user/user';
import { ChatService } from './providers/chat-service/chat-service';

import { init as AVInit, Query as AVQuery, User as AVUser } from 'leancloud-storage';
import { Realtime as AVRealtime, IMClient as AVIMClient } from 'leancloud-realtime';

// 页面
import { TabsPage } from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome'

@Component({
  templateUrl: 'build/app.html',
  providers: [UserProvider, ChatService]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public events: Events,
    public userProvider: UserProvider,
    public chatService: ChatService,
    public platform: Platform) {
    this.initializeApp();
  }
  leancloud = {
    appId: '3knLr8wGGKUBiXpVAwDnryNT-gzGzoHsz',
    appKey: '3RpBhjoPXJjVWvPnVmPyFExt',
    region: 'cn',
    publicConId: '57fc97f55bbb50005b3a25a9'
  };
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.initLeanCloud();
      this.listenToLoginEvents();
      this.userProvider.validate().then(valid => {
        this.toggleLogIn(valid);
      });
    });
  }
  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.toggleLogIn(true);
    });
  }
  initLeanCloud() {
    // 存储服务初始化
    AVInit({ appId: this.leancloud.appId, appKey: this.leancloud.appKey });
  }
  toggleLogIn(loggedIn) {
    // 之前登录过，并且 sesstionToken 并没有过期
    if (loggedIn) {
      this.nav.setRoot(TabsPage);
      // 聊天服务初始化
      //this.chatService.init(this.leancloud);
    } else {
      this.nav.setRoot(LoginPage);
    }
  }
}

ionicBootstrap(MyApp);
