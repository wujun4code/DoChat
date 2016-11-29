import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ChatPage } from '../../pages/chat/chat';
export var ContactDetailPage = (function () {
    function ContactDetailPage(navCtrl, navParams, events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.events = events;
        this.friendId = this.navParams.get('friendId');
        console.log('ContactDetailPage.friendId', this.friendId);
    }
    ContactDetailPage.prototype.ionViewDidLoad = function () {
    };
    ContactDetailPage.prototype.navToChatPage = function (event) {
        var targetClientId = event.clientId;
        var targetMarkName = event.markName;
        // SharedService.client.createConversation({
        //   members: [targetClientId],
        //   unique: true,
        //   transient: false,
        //   markedName: [SharedService.clientId, targetMarkName],
        //   type: 'private'
        // }).then(conv => {
        //   this.events.publish('lc_conv_opened', conv);
        //   this.navCtrl.push(ChatPage, { id: conv.id, name: targetMarkName });
        // }).catch(error => {
        //   console.log(error.stack)
        // });
        this.navCtrl.push(ChatPage, { name: targetMarkName, friendId: targetClientId });
    };
    ContactDetailPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-contact-detail',
                    templateUrl: 'contact-detail.html'
                },] },
    ];
    /** @nocollapse */
    ContactDetailPage.ctorParameters = [
        { type: NavController, },
        { type: NavParams, },
        { type: Events, },
    ];
    return ContactDetailPage;
}());
