import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var ProfilePage = (function () {
    function ProfilePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ProfilePage.prototype.ionViewDidLoad = function () {
        console.log('Hello Profile Page');
    };
    ProfilePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-profile',
                    templateUrl: 'profile.html'
                },] },
    ];
    /** @nocollapse */
    ProfilePage.ctorParameters = [
        { type: NavController, },
    ];
    return ProfilePage;
}());
