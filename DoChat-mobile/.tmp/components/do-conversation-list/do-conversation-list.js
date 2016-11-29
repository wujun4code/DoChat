import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import { Realtime, TextMessage } from 'leancloud-realtime';
import { lcGlobal, SharedService } from '../lc-global';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';
import { DoConversation } from '../do-conversation-list/do-conversation-item';
import { DoDataService } from '../../providers/data-service';
import { Observable } from 'rxjs';
export var DoConversationList = (function () {
    function DoConversationList(events, viewCtrl, dataService) {
        var _this = this;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.dataService = dataService;
        this.convClicked = new EventEmitter();
        this.onUnreadNoticed = new EventEmitter();
        this.items = [];
        this.events.subscribe('lc:send', function (sendEventData) {
            _this.send(sendEventData[0]);
        });
        this.zone = new NgZone({ enableLongStackTrace: false });
    }
    Object.defineProperty(DoConversationList.prototype, "clientId", {
        set: function (clientId) {
            this.currentClientId = clientId;
            this.cacheProvider = new MessageProvider();
            this.initList();
        },
        enumerable: true,
        configurable: true
    });
    DoConversationList.prototype.initList = function () {
        // let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
        // realtime.createIMClient(this.currentClientId).then(imClient => {
        //   //this.avIMClient = imClient;
        //   SharedService.client = imClient;
        //   SharedService.client.on('message', (message: Message, conversation: Conversation) => {
        //     let eventName: string = 'lc:received:' + conversation.id;
        //     // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
        //     if (lcGlobal.realtime_config.localCache) {
        //       this.cacheProvider.getProvider(this.currentClientId).push(message, conversation);
        //     }
        //     console.log('Message received: ', message.id, message.type, JSON.stringify(message), eventName);
        //     if (message.cid != SharedService.currentConv) {
        //       this.onBadgeEmit(1);
        //     }
        //     this.updateLastMessage(this.items, message);
        //     this.events.publish(eventName, message);
        //     this.events.publish('onMessage', message);
        //   });
        var _this = this;
        this.events.subscribe('lc_conv_opened', function (data) {
            var conv = data[0];
            console.log('onConvOpend', conv.id);
            _this.appendConv(conv, null, 0);
        });
        //   return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
        // }).then(cons => {
        //   this.zone.run(() => {
        //     cons = cons.sort(this.sortByUpdatedAt);
        //     cons.forEach((v, i, a) => {
        //       this.extractConv(v).then(exConv => {
        //         this.items.push(exConv);
        //       });
        //     });
        //   });
        // }).catch(error => {
        //   console.log(error.stack);
        // });
        /// obs research
        var realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
        this.obsConvs = new Observable(function (observer) {
            realtime.createIMClient(_this.currentClientId).then(function (imClient) {
                SharedService.client = imClient;
                SharedService.client.on('membersjoined', _this.onJoinedConversation);
                SharedService.client.on('message', function (message, conversation) {
                    // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
                    if (lcGlobal.realtime_config.localCache) {
                        _this.cacheProvider.getProvider(_this.currentClientId).push(message, conversation);
                    }
                    console.log('Message received: ', message.id, message.type, JSON.stringify(message));
                    if (message.cid != SharedService.currentConv) {
                        _this.onBadgeEmit(1);
                    }
                    _this.updateLastMessage(_this.items, message);
                    _this.appendConv(conversation, message, 1);
                    _this.events.publish('onMessage', message);
                    _this.events.publish('onRXMessage', message);
                });
                return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
            }).then(function (cons) {
                var done = 0;
                cons.forEach(function (v, i, a) {
                    _this.extractConv(v, null, 0).then(function (exConv) {
                        observer.next(exConv);
                        done++;
                        if (done == a.length) {
                            observer.complete();
                        }
                    });
                });
            });
        });
        var subscription = this.obsConvs.forEach(function (v) {
            _this.items.push(v);
        }).then(function () {
            _this.items = _this.items.sort(_this.sortByUpdatedAt);
        });
    };
    DoConversationList.prototype.sortByUpdatedAt = function (a, b) {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    };
    DoConversationList.prototype.extractConv = function (v, msg, unreadBadge) {
        var _this = this;
        var rtnModel = new DoConversation();
        var text = '';
        var from = '';
        if (msg) {
            v.lastMessage = msg;
        }
        var receivedAt = v.lastMessageAt || new Date('1970-01-01');
        if (v.lastMessage) {
            from = v.lastMessage.from;
            if (v.lastMessage instanceof TextMessage) {
                text = v.lastMessage.getText();
            }
        }
        var lastMessage = v.lastMessage ? { from: from, text: text, receivedAt: receivedAt } : null;
        var name = v.name || '';
        var type = v.get('type') || '';
        if (type == 'private') {
            var friendIds = v.members.filter(function (m, i, a) {
                return m != SharedService.clientId;
            });
            console.log('v.members', v.members);
            var friendId_1 = friendIds[0] || '';
            var makedNameArray = v.get('markedName') || [];
            var index = makedNameArray.indexOf(SharedService.clientId);
            if (index > -1) {
                var markedName = makedNameArray[index + 1] || '';
                if (markedName.length > 1) {
                    name = markedName;
                }
            }
            return this.dataService.getFriendById(SharedService.clientId, friendId_1).then(function (friend) {
                var avatar = '';
                if (friend != null) {
                    avatar = friend.avatar;
                }
                if (name.length == 0)
                    name = friendId_1;
                if (lastMessage) {
                    return _this.dataService.getFriendById(SharedService.clientId, lastMessage.from).then(function (lastSender) {
                        if (lastSender != null) {
                            if (lastSender.markName && lastSender.markName.length > 0)
                                lastMessage.from = lastSender.markName;
                            else if (lastSender.nickName && lastSender.nickName.length > 0) {
                                lastMessage.from = lastSender.nickName;
                            }
                        }
                        rtnModel = {
                            id: v.id,
                            name: name,
                            lastMessage: lastMessage,
                            unreadBadge: unreadBadge,
                            titleImg: avatar,
                            updatedAt: v.updatedAt
                        };
                        return rtnModel;
                    });
                }
                else {
                    rtnModel = {
                        id: v.id,
                        name: name,
                        lastMessage: lastMessage,
                        unreadBadge: unreadBadge,
                        titleImg: avatar,
                        updatedAt: v.updatedAt
                    };
                    return rtnModel;
                }
            });
        }
        else {
            if (lastMessage) {
                return this.dataService.getFriendById(SharedService.clientId, lastMessage.from).then(function (friend) {
                    if (friend != null) {
                        if (friend.markName && friend.markName.length > 0)
                            lastMessage.from = friend.markName;
                        else if (friend.nickName && friend.nickName.length > 0) {
                            lastMessage.from = friend.nickName;
                        }
                    }
                    rtnModel = {
                        id: v.id,
                        name: name,
                        lastMessage: lastMessage,
                        unreadBadge: unreadBadge,
                        updatedAt: v.updatedAt
                    };
                    return rtnModel;
                });
            }
            else {
                return new Promise(function (resolve) {
                    rtnModel = {
                        id: v.id,
                        name: name,
                        lastMessage: lastMessage,
                        unreadBadge: unreadBadge,
                        updatedAt: v.updatedAt
                    };
                    resolve(rtnModel);
                });
            }
        }
    };
    DoConversationList.prototype.removeElement = function (a, el) {
        var index = a.indexOf(el);
        if (index > -1) {
            return a.splice(index - 1, 1);
        }
        else {
            return a;
        }
    };
    DoConversationList.prototype.onJoinedConversation = function (payload, conversation) {
        console.log('onJoinedConversation', JSON.stringify(payload), conversation.id);
    };
    DoConversationList.prototype.onConversationItemClick = function (event, item) {
        this.onBadgeEmit(-item.unreadBadge);
        item.unreadBadge = 0;
        this.convClicked.emit({ id: item.id, name: item.name });
    };
    DoConversationList.prototype.onBadgeEmit = function (payload) {
        SharedService.unreadBadge += payload;
        this.events.publish('messageBadge', SharedService.unreadBadge);
    };
    DoConversationList.prototype.send = function (sendEventData) {
        var _this = this;
        var convIdStr = sendEventData.id;
        SharedService.client.getConversation(convIdStr, true).then(function (conv) {
            var txtMessage = new TextMessage(sendEventData.text);
            //conv.send(txtMessage, { priority: MessagePriority.HIGH });
            return conv.send(txtMessage);
        }).then(function (message) {
            _this.updateLastMessage(_this.items, message);
            _this.events.publish('lc:sent:' + convIdStr, message);
            _this.events.publish('onMessage', message);
        }).catch(function (reason) {
            console.log('error:', reason.stack);
        });
    };
    DoConversationList.prototype.getMessageHistroyFromServer = function (convId, pIndex, pSize) {
        var convIdStr = convId;
        SharedService.client.getConversation(convIdStr, true).then(function (conv) {
        });
    };
    DoConversationList.prototype.updateLastMessage = function (convArray, message) {
        var _this = this;
        var checker = convArray || [];
        if (checker.length < 1)
            return;
        this.zone.run(function () {
            var text = '';
            if (message instanceof TextMessage) {
                text = message.getText();
            }
            else {
                text = '';
            }
            var targets = convArray.filter(function (conv) {
                return conv.id == message.cid;
            });
            if (targets.length < 1)
                return;
            var v = targets[0];
            var currentIndex = convArray.indexOf(v);
            if (message.cid != SharedService.currentConv) {
                if (v.unreadBadge) {
                    v.unreadBadge += 1;
                }
                else {
                    v.unreadBadge = 1;
                }
            }
            if (v.lastMessage == null)
                v.lastMessage = {};
            v.lastMessage.text = text;
            v.updatedAt = new Date();
            convArray.splice(currentIndex, 1);
            convArray.splice(0, 0, v);
            if (message) {
                _this.dataService.getFriendById(SharedService.clientId, message.from).then(function (sender) {
                    console.log('v', JSON.stringify(v), 'sender', JSON.stringify(sender));
                    v.lastMessage.from = message.from;
                    if (sender != null) {
                        if (sender.markName && sender.markName.length > 0)
                            v.lastMessage.from = sender.markName;
                        else if (sender.nickName && sender.nickName.length > 0) {
                            v.lastMessage.from = sender.nickName;
                        }
                    }
                });
            }
        });
    };
    DoConversationList.prototype.appendConv = function (conv, msg, unreadBadge) {
        var _this = this;
        this.zone.run(function () {
            var duplicateChecker = _this.items.filter(function (item) {
                return item.id == conv.id;
            });
            if (duplicateChecker.length == 0) {
                _this.extractConv(conv, msg, unreadBadge).then(function (exConv) {
                    _this.items.splice(0, 0, exConv);
                });
            }
        });
    };
    DoConversationList.decorators = [
        { type: Component, args: [{
                    selector: 'do-conversation-list',
                    templateUrl: 'do-conversation-list.html',
                },] },
    ];
    /** @nocollapse */
    DoConversationList.ctorParameters = [
        { type: Events, },
        { type: ViewController, },
        { type: DoDataService, },
    ];
    DoConversationList.propDecorators = {
        'clientId': [{ type: Input },],
        'convClicked': [{ type: Output },],
        'onUnreadNoticed': [{ type: Output },],
    };
    return DoConversationList;
}());
