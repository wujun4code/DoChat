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
import { Storage } from '@ionic/storage';
import { uiInjectables, pipeInjectables, dataInjectables, schemaInjectables } from '../components/do-exports';
var schemas = [];
schemas.push(CUSTOM_ELEMENTS_SCHEMA, schemaInjectables, IONIC_DIRECTIVES);
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
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
                        IonicModule.forRoot(MyApp, {
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
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = [];
    return AppModule;
}());
