import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContactDetailPage } from '../contact-detail/contact-detail';
export var ContactPage = (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage.prototype.onFriendTapped = function (event) {
        this.navCtrl.push(ContactDetailPage, { friendId: event.clientId });
    };
    ContactPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-contact',
                    templateUrl: 'contact.html'
                },] },
    ];
    /** @nocollapse */
    ContactPage.ctorParameters = [
        { type: NavController, },
    ];
    return ContactPage;
}());
