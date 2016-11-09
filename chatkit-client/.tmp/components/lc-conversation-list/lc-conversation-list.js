import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { Realtime, TextMessage } from 'leancloud-realtime';
import { lcGlobal, SharedService } from '../lc-global';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';
export var LCConversationList = (function () {
    function LCConversationList(ref, events) {
        var _this = this;
        this.ref = ref;
        this.events = events;
        this.convClicked = new EventEmitter();
        this.items = [];
        this.events.subscribe('lc:send', function (sendEventData) {
            _this.send(sendEventData[0]);
        });
        this.zone = new NgZone({ enableLongStackTrace: false });
    }
    Object.defineProperty(LCConversationList.prototype, "clientId", {
        set: function (clientId) {
            this.currentClientId = clientId;
            this.cacheProvider = new MessageProvider();
            this.initList();
        },
        enumerable: true,
        configurable: true
    });
    LCConversationList.prototype.initList = function () {
        var _this = this;
        var realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
        realtime.createIMClient(this.currentClientId).then(function (imClient) {
            //this.avIMClient = imClient;
            SharedService.client = imClient;
            SharedService.client.on('message', function (message, conversation) {
                var eventName = 'lc:received:' + conversation.id;
                // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
                if (lcGlobal.realtime_config.localCache) {
                    _this.cacheProvider.getProvider(_this.currentClientId).push(message, conversation);
                }
                console.log('Message received: ', message.id, message.type, JSON.stringify(message), eventName);
                _this.updateLastMessage(message);
                _this.events.publish(eventName, message);
            });
            return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
        }).then(function (cons) {
            _this.zone.run(function () {
                cons.forEach(function (v, i, a) {
                    var text = '';
                    if (v.lastMessage instanceof TextMessage) {
                        text = v.lastMessage.getText();
                    }
                    else {
                        text = '';
                    }
                    _this.items.push({
                        id: v.id,
                        name: v.name,
                        lastMessage: { from: v.lastMessage.from, text: text }
                    });
                });
            });
        });
    };
    LCConversationList.prototype.onConversationItemClick = function (conv) {
        this.convClicked.emit({ id: conv.id, name: conv.name });
    };
    LCConversationList.prototype.send = function (sendEventData) {
        var _this = this;
        var convIdStr = sendEventData.id;
        SharedService.client.getConversation(convIdStr, true).then(function (conv) {
            var txtMessage = new TextMessage(sendEventData.text);
            console.log(JSON.stringify(_this.items));
            console.log('send(sendEventData)');
            return conv.send(txtMessage);
        }).then(function (message) {
            _this.updateLastMessage(message);
            _this.events.publish('lc:sent:' + convIdStr, message);
        }).catch(function (reason) {
            console.log('error:', reason.stack);
        });
    };
    LCConversationList.prototype.getMessageHistroyFromServer = function (convId, pIndex, pSize) {
        var convIdStr = convId;
        SharedService.client.getConversation(convIdStr, true).then(function (conv) {
        });
    };
    LCConversationList.prototype.updateLastMessage = function (message) {
        var _this = this;
        this.zone.run(function () {
            var text = '';
            if (message instanceof TextMessage) {
                text = message.getText();
            }
            else {
                text = '';
            }
            _this.items.filter(function (conv) {
                return conv.id == message.cid;
            }).forEach(function (v, i, a) {
                v.lastMessage.from = message.from;
                v.lastMessage.text = text;
            });
        });
    };
    LCConversationList.decorators = [
        { type: Component, args: [{
                    selector: 'lc-conversation-list',
                    templateUrl: 'lc-conversation-list.html',
                },] },
    ];
    /** @nocollapse */
    LCConversationList.ctorParameters = [
        { type: ChangeDetectorRef, },
        { type: Events, },
    ];
    LCConversationList.propDecorators = {
        'clientId': [{ type: Input },],
        'convClicked': [{ type: Output },],
    };
    return LCConversationList;
}());
