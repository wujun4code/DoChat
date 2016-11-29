import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ContactPage;
  tab3Root: any = DiscoverPage;
  tab4Root: any = ProfilePage;

  unreadMessageBadge: number;
  constructor(public events: Events) {
    this.events.subscribe('messageBadge', data => {
      this.unreadMessageBadge = data[0];
    });
  }
}
