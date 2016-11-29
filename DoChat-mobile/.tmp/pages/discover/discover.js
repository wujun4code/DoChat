import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
export var DiscoverPage = (function () {
    function DiscoverPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    DiscoverPage.prototype.ionViewDidEnter = function () {
    };
    DiscoverPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-discover',
                    templateUrl: 'discover.html'
                },] },
    ];
    /** @nocollapse */
    DiscoverPage.ctorParameters = [
        { type: NavController, },
    ];
    return DiscoverPage;
}());
