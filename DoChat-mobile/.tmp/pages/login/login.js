import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SharedService } from '../../components/lc-global';
import { DoDataService } from '../../providers/data-service';
export var LoginPage = (function () {
    function LoginPage(navCtrl, dataService) {
        this.navCtrl = navCtrl;
        this.dataService = dataService;
    }
    LoginPage.prototype.goHome = function (event) {
        console.log('clientId', this.clientId);
        SharedService.clientId = this.clientId;
        this.navCtrl.setRoot(TabsPage, { clientId: this.clientId });
        this.dataService.createMessageTable(this.clientId);
    };
    LoginPage.prototype.onKeypress = function (event) {
        if (event.keyCode == 13) {
            this.goHome(event);
        }
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
        { type: DoDataService, },
    ];
    return LoginPage;
}());
