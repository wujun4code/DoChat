import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { DiscoverPage } from '../pages/discover/discover';
import { ContactPage } from '../pages/contact/contact';
import { ContactDetailPage } from '../pages/contact-detail/contact-detail';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ChatPage } from '../pages/chat/chat';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { IONIC_DIRECTIVES } from 'ionic-angular';
import { TextImage } from '../components/text-img/text-img';
import { Storage } from '@ionic/storage';

import { uiInjectables, pipeInjectables, dataInjectables, schemaInjectables } from '../components/do-exports';

let schemas: any[] = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA, schemaInjectables, IONIC_DIRECTIVES);
@NgModule({
  declarations: [
    MyApp,
    DiscoverPage,
    ContactPage,
    ContactDetailPage,
    HomePage,
    ProfilePage,
    ChatPage,
    LoginPage,
    TabsPage,
    uiInjectables,
    pipeInjectables,
    schemaInjectables

  ],
  imports: [
    IonicModule.forRoot(MyApp,
      {
        tabsHideOnSubPages: true,
        statusbarPadding: true
      })
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
    LoginPage,
    ContactDetailPage
  ],
  providers: [
    Storage,
    dataInjectables
  ],
  schemas: schemas
})
export class AppModule { }
