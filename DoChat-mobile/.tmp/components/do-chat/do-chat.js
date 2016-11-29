import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Events, ViewController, NavController, Content, Refresher } from 'ionic-angular';
import { SharedService } from '../lc-global';
import { NgZone } from '@angular/core';
import { DoChatService } from '../../providers/chat-service';
import { DoDataService } from '../../providers/data-service';
import { DoUserService } from '../../providers/user-service';
export var DoChat = (function () {
    function DoChat(events, dataService, ref, chatService, userService, viewCtrl, navCtrl) {
        this.events = events;
        this.dataService = dataService;
        this.ref = ref;
        this.chatService = chatService;
        this.userService = userService;
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.membersInConv = [];
        this.orgeMessages = [];
        this.opMessages = [];
        this.onMsg = new EventEmitter();
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.viewCtrl.willLeave.subscribe(this.willLeave);
        this.loadingText = '正在加载...';
        this.pullingText = '下拉获取更多...';
    }
    DoChat.prototype.randomLoadingText = function () {
        if (this.noMoreRecord)
            return '真的没了，不要再拉了...';
        var rltx = ['正在加载...', '不要催我 - -!...', '快要拉不动了啦~', '快拉出来了，咦？口味有点重'];
        // let rltx = ['不要催我，我这不在给您加载么 \U+1F602'];
        return rltx[Math.floor(Math.random() * rltx.length)];
    };
    ;
    Object.defineProperty(DoChat.prototype, "convId", {
        set: function (convId) {
            this.conversationId = convId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoChat.prototype, "convName", {
        set: function (convName) {
            this.conversationName = convName;
        },
        enumerable: true,
        configurable: true
    });
    DoChat.prototype.scrollScreen = function () {
        var _this = this;
        this.chatContent.scrollToBottom().then(function () {
            return _this.chatContent.scrollToBottom();
        }).then(function () {
            return _this.chatContent.scrollToBottom();
        });
    };
    DoChat.prototype.ngOnInit = function () {
        var _this = this;
        this.initConv().then(function (conv) {
            _this.conv = conv;
            _this.friendIds = _this.conv.members.filter(function (v, i, a) {
                return v != SharedService.clientId;
            });
            _this.isPrivate = conv.get('type') == 'private';
            if (!_this.isPrivate) {
                _this.convTitleText = conv.name;
            }
            SharedService.currentConv = conv.id;
            _this.conversationId = conv.id;
            _this.userService.getDoFriendByIds(_this.friendIds).forEach(function (next) {
                if (_this.isPrivate) {
                    var doFriend = next;
                    _this.hasAvatar = doFriend.hasAvatar();
                    _this.convTitleImg = doFriend.getAvatar();
                    _this.convTitleText = doFriend.getNameText();
                }
            });
            var inventoryBuffer = [];
            var down = true;
            _this.chatService.subscribeLoadHistory(conv).forEach(function (next) {
                if (next.fixedLimit < 0) {
                    _this.noMoreRecord = true;
                    _this.pullingText = '没有更多记录了...';
                    _this.zone.run(function () {
                        _this.refresher.complete();
                    });
                    inventoryBuffer = [];
                    return;
                }
                inventoryBuffer.push(next);
                var fixedLimit = next.fixedLimit;
                if (inventoryBuffer.length >= fixedLimit) {
                    inventoryBuffer = inventoryBuffer.sort(function (a, b) {
                        var bx = a.batchNumber - b.batchNumber;
                        if (bx != 0)
                            return bx;
                        return a.batchIndex - b.batchIndex;
                    }).map(function (t, i, arr) {
                        t.product.isInPrivateConv = _this.isPrivate;
                        return t;
                    });
                    _this.zone.run(function () {
                        if (down) {
                            _this.orgeMessages = _this.orgeMessages.concat(inventoryBuffer.map(function (v, i, a) {
                                return v.product;
                            }));
                            _this.scrollScreen();
                            down = false;
                        }
                        else {
                            // let temp = inventoryBuffer.map((v, i, a) => {
                            //     return v.product;
                            // });
                            // inventoryBuffer.forEach((v, i, a) => {
                            //     this.orgeMessages.splice(0, 0, v.product);
                            // });
                            while (inventoryBuffer.length > 0) {
                                var ib = inventoryBuffer.pop();
                                _this.orgeMessages.splice(0, 0, ib.product);
                            }
                        }
                        _this.refresher.complete();
                    });
                    inventoryBuffer = [];
                }
            });
            _this.chatService.subscribeOnMessage(_this.conv).forEach(function (next) {
                _this.zone.run(function () {
                    next.isInPrivateConv = _this.isPrivate;
                    _this.orgeMessages.push(next);
                });
                _this.scrollScreen();
                _this.onMsg.emit(next);
            });
            _this.chatService.operatioStream.forEach(function (next) {
                if (next.convId == _this.conv.id) {
                    var duplicateChecker = _this.opMessages.find(function (v) {
                        return v.from == next.from;
                    });
                    if (duplicateChecker) {
                        duplicateChecker.op = next.op;
                    }
                    else {
                        _this.opMessages.push(next);
                    }
                }
            });
        });
    };
    DoChat.prototype.initConv = function () {
        var _this = this;
        var convIdChecker = this.conversationId || '';
        if (convIdChecker.length > 0) {
            return SharedService.client.getConversation(this.conversationId, true);
        }
        else {
            var convName = this.friendIds.length > 1 ? this.conversationName : '';
            var type = this.friendIds.length > 1 ? 'group' : 'private';
            return SharedService.client.createConversation({
                members: this.friendIds,
                unique: true,
                transient: false,
                name: convName,
                markedName: [SharedService.clientId, this.conversationName],
                type: type
            }).then(function (conv) {
                console.log('conv', conv.members);
                _this.events.publish('lc_conv_opened', conv);
                console.log('conv.then', conv.members);
                return conv;
            }).catch(function (error) {
                console.log(error.stack);
            });
        }
    };
    DoChat.prototype.doRefresh = function (refresher) {
        // this.loadLatest().then(d => {
        //     refresher.complete();
        // });
        this.loadingText = this.randomLoadingText();
        if (!this.noMoreRecord) {
            var head = this.orgeMessages[0];
            var tail = this.orgeMessages[this.orgeMessages.length - 1];
            if (this.orgeMessages.length > 0) {
                var flagDatetime = head.receivedAt;
                this.chatService.iterateHistory(this.conv, flagDatetime);
            }
        }
        else {
            setTimeout(function () {
                refresher.complete();
            }, 500);
        }
    };
    DoChat.prototype.doStart = function (refresher) {
        console.log('Refresher, start');
    };
    DoChat.prototype.doPulling = function (refresher) {
        console.log('Pulling', refresher.progress);
    };
    DoChat.prototype.ngAfterViewInit = function () {
        console.log('AfterViewInit', this.conversationId, this.conversationName);
    };
    DoChat.prototype.ngAfterContentInit = function () {
        console.log('AfterContentInit', this.conversationId, this.conversationName);
    };
    DoChat.prototype.willLeave = function () {
        SharedService.currentConv = '';
    };
    DoChat.decorators = [
        { type: Component, args: [{
                    selector: 'do-chat',
                    templateUrl: 'do-chat.html'
                },] },
    ];
    /** @nocollapse */
    DoChat.ctorParameters = [
        { type: Events, },
        { type: DoDataService, },
        { type: ChangeDetectorRef, },
        { type: DoChatService, },
        { type: DoUserService, },
        { type: ViewController, },
        { type: NavController, },
    ];
    DoChat.propDecorators = {
        'chatContent': [{ type: ViewChild, args: [Content,] },],
        'refresher': [{ type: ViewChild, args: [Refresher,] },],
        'friendIds': [{ type: Input },],
        'convId': [{ type: Input },],
        'convName': [{ type: Input },],
        'onMsg': [{ type: Output },],
    };
    return DoChat;
}());
