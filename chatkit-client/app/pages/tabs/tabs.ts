import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
// 对话列表页
import { ConversationListPage } from '../conversation-list/conversation-list';
// 通讯录列表页
import { ContactsPage } from '../contacts/contacts';
// 发现页
import { DiscoverPage } from '../discover/discover';
// 个人资料页
import { ProfilePage } from '../profile/profile';

/*
  Generated class for the TabsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = ConversationListPage;
  tab2Root: any = ContactsPage;
  tab3Root: any = DiscoverPage;
  tab4Root: any = ProfilePage;

  mySelectedIndex: number;

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
