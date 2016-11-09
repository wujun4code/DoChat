import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SharedService } from '../../components/lc-global';
export var LoginPage = (function () {
    function LoginPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    LoginPage.prototype.goHome = function (event) {
        console.log('clientId', this.clientId);
        SharedService.clientId = this.clientId;
        this.navCtrl.setRoot(TabsPage, { clientId: this.clientId });
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('Hello Login Page');
    };
    LoginPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-login',
                    templateUrl: 'login.html'
                },] },
    ];
    /** @nocollapse */
    LoginPage.ctorParameters = [
        { type: NavController, },
    ];
    return LoginPage;
}());
