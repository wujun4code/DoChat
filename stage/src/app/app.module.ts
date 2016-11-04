import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { DiscoverPage } from '../pages/discover/discover';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { TextImage } from '../components/text-img/text-img';
import { LCChat } from '../components/lc-chat/lc-chat';
import { LCConversationList } from '../components/lc-conversation-list/lc-conversation-list';
import { Xtest } from '../components/xtest/xtest';

let schemas: any[] = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA);
@NgModule({
  declarations: [
    MyApp,
    DiscoverPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage,
    TextImage,
    Xtest,
    LCChat,
    LCConversationList
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DiscoverPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage
  ],
  providers: [],
  schemas: schemas
})
export class AppModule { }
