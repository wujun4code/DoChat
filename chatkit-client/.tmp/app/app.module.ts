import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { DiscoverPage } from '../pages/discover/discover';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { TextImage } from '../components/text-img/text-img';
import { LCInputBox } from '../components/lc-input-box/lc-input-box';
import { LCChat } from '../components/lc-chat/lc-chat';
import { LCConversationList } from '../components/lc-conversation-list/lc-conversation-list';
import { LCContactList } from '../components/lc-contact-list/lc-contact-list';
import { Xtest } from '../components/xtest/xtest';
import { IONIC_DIRECTIVES } from 'ionic-angular';
import { Storage } from '@ionic/storage';


let schemas: any[] = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA);
@NgModule({
  declarations: [
    MyApp,
    DiscoverPage,
    ContactPage,
    HomePage,
    ProfilePage,
    ChatPage,
    LoginPage,
    TabsPage,
    TextImage,
    Xtest,
    LCChat,
    LCConversationList,
    LCInputBox,
    LCContactList
  ],
  imports: [
    IonicModule.forRoot(MyApp, { tabsHideOnSubPages: true })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DiscoverPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage,
    ChatPage,
    LoginPage
  ],
  providers: [Storage],
  schemas: schemas
})
export class AppModule { }
