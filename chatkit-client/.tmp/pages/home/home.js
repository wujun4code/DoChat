import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatPage } from '../../pages/chat/chat';
import { SharedService } from '../../components/lc-global';
export var HomePage = (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
        this.clientId = SharedService.clientId;
    }
    HomePage.prototype.ionViewDidLoad = function () {
        console.log('home ionViewDidLoad');
    };
    //con: {"id":"57fdb59cfab00f41dd84ed7e","name":"conversation name"}
    HomePage.prototype.navToChat = function (con) {
        console.log('navToChat clicked.', JSON.stringify(con));
        this.navCtrl.push(ChatPage, { id: con.id, name: con.name, conv: con.metaData });
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html',
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = [
        { type: NavController, },
    ];
    return HomePage;
}());
