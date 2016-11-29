import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SharedService } from '../../components/lc-global';
export var ChatPage = (function () {
    function ChatPage(navCtrl, params, viewCtrl) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.convId = this.params.get('id') || '';
        this.convName = this.params.get('name') || '';
        this.friendId = this.params.get('friendId') || '';
        this.friendIds = this.params.get('friendIds') || [];
        if (this.friendIds.length == 0 && this.friendId.length > 0) {
            this.friendIds = [this.friendId];
        }
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        var noticeText = SharedService.getNoticText();
        console.log('noticeText', noticeText);
        this.viewCtrl.setBackButtonText(noticeText);
    };
    ChatPage.prototype.onMessage = function (message) {
    };
    ChatPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-chat',
                    templateUrl: 'chat.html'
                },] },
    ];
    /** @nocollapse */
    ChatPage.ctorParameters = [
        { type: NavController, },
        { type: NavParams, },
        { type: ViewController, },
    ];
    return ChatPage;
}());
