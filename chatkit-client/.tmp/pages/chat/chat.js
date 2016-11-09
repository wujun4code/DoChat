import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
export var ChatPage = (function () {
    function ChatPage(navCtrl, params) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.convId = this.params.get('id');
        this.convName = this.params.get('name');
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var ticks = 2;
        var timerId = setInterval(function () {
            console.log('this.chatContent.scrollToBottom(200)');
            _this.chatContent.scrollToBottom(); //200ms animation speed
            ticks--;
            if (ticks == 0) {
                clearInterval(timerId);
            }
        }, 500);
        setTimeout(function () {
            _this.chatContent.scrollToBottom();
            //clearInterval(timerId);
        });
    };
    ChatPage.prototype.onMessage = function (message) {
        console.log('parent page', JSON.stringify(message));
        this.chatContent.scrollToBottom();
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
    ];
    ChatPage.propDecorators = {
        'chatContent': [{ type: ViewChild, args: [Content,] },],
    };
    return ChatPage;
}());
