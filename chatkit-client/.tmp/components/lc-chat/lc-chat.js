import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { TextMessage } from 'leancloud-realtime';
import { Events } from 'ionic-angular';
import { lcGlobal, SharedService } from '../lc-global';
import { NgZone } from '@angular/core';
export var LCChat = (function () {
    function LCChat(events, ref) {
        this.events = events;
        this.ref = ref;
        this.onMsg = new EventEmitter();
        this.msgsInConv = [];
        this.zone = new NgZone({ enableLongStackTrace: false });
    }
    Object.defineProperty(LCChat.prototype, "convId", {
        set: function (convId) {
            var _this = this;
            this.conversationId = convId;
            var eventName = 'lc:received:' + this.conversationId;
            console.log('set convId', eventName);
            if (lcGlobal.realtime_config.localCache) {
            }
            else {
                SharedService.client.getConversation(this.conversationId).then(function (conv) {
                    _this.messageIterator = conv.createMessagesIterator({ limit: 20 });
                    _this.messageIterator.next().then(function (result) {
                        console.dir(result);
                        result.value.forEach(function (v, i, a) {
                            var text = '';
                            if (v instanceof TextMessage) {
                                text = v.getText();
                            }
                            var fromMe = v.from == SharedService.client.id;
                            _this.msgsInConv.push({
                                from: v.from,
                                avatar: 'assets/img/thumbnail-kitten-2.jpg',
                                text: text,
                                fromMe: fromMe
                            });
                        });
                    });
                });
            }
            this.events.subscribe('lc:received:' + this.conversationId, function (data) {
                var message = data[0];
                _this.zone.run(function () {
                    _this.msgsInConv.push({
                        from: message.from,
                        avatar: 'assets/img/thumbnail-kitten-2.jpg',
                        text: message._lctext,
                        fromMe: false
                    });
                });
                //this.ref.detectChanges();
                _this.onMsg.emit(message);
            });
            this.events.subscribe('lc:sent:' + this.conversationId, function (data) {
                var message = data[0];
                _this.zone.run(function () {
                    _this.msgsInConv.push({
                        avatar: 'assets/img/thumbnail-kitten-2.jpg',
                        text: message._lctext,
                        fromMe: true
                    });
                });
                //this.ref.detectChanges();
                _this.onMsg.emit(message);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LCChat.prototype, "convName", {
        set: function (convName) {
            this.conversationName = convName;
            console.log('this.conversationName', this.conversationName);
        },
        enumerable: true,
        configurable: true
    });
    LCChat.decorators = [
        { type: Component, args: [{
                    selector: 'lc-chat',
                    templateUrl: 'lc-chat.html'
                },] },
    ];
    /** @nocollapse */
    LCChat.ctorParameters = [
        { type: Events, },
        { type: ChangeDetectorRef, },
    ];
    LCChat.propDecorators = {
        'convId': [{ type: Input },],
        'convName': [{ type: Input },],
        'onMsg': [{ type: Output },],
    };
    return LCChat;
}());
