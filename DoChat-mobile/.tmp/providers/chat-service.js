import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject } from 'rxjs';
import { Events } from 'ionic-angular';
import { SharedService } from '../components/lc-global';
import { TextMessage } from 'leancloud-realtime';
import { DoUserService, DoFriend } from './user-service';
import { DoDataService } from './data-service';
export var DoChatService = (function () {
    function DoChatService(http, events, userService, dataService) {
        var _this = this;
        this.http = http;
        this.events = events;
        this.userService = userService;
        this.dataService = dataService;
        this.memberStream = new Subject();
        this.newMessages = new Subject();
        this.localStorage = new Subject();
        this.wrapMessageStream = new Subject();
        this.sendMessageStream = new Subject();
        this.operatioStream = new Subject();
        this.historyControlFlow = new Subject();
        this.historyExpress = new Subject();
        this.historyControlFlow.forEach(function (flowPayload) {
            _this.historyExpress.next(flowPayload);
        });
        // 消息送达第一时间送到 wrap 工厂进行包装，将 LeanCloud 封装的消息包装成页面上需要显示的数据
        this.wrapMessageStream.subscribe(this.newMessages);
        // 包装好的消息就通知本地缓存工厂，进行存储
        // this.newMessages.subscribe(this.localStorage);
        this.localStorage.forEach(function (nextMessage) {
            console.log('begin to local storage', 'engine:sqlite');
            _this.dataService.saveAVMessage(SharedService.clientId, nextMessage).then(function (s) { }, function (error) {
                //{"code":6,"message":"UNIQUE constraint failed: Message.id"}
                if (error.code == 6 && error.message.indexOf('Message.id') > 0) {
                    _this.dataService.synced = true;
                }
            });
        });
        // SharedService.client.on('message', (message: AVMesage, conversation: Conversation) => {
        //   console.log('ChatService.this.refCount',this.refCount);
        //   this.onNewMessage(message);
        // });
        this.events.subscribe('onRXMessage', function (data) {
            console.log('onRXMessage', data[0], JSON.stringify(data[0]));
            var message = data[0];
            _this.wrapAVMessage(message);
        });
    }
    DoChatService.prototype.subscribeOnMessage = function (conv) {
        return this.newMessages.map(function (orgMessage) {
            if (orgMessage.convId == conv.id) {
                return orgMessage;
            }
        });
    };
    DoChatService.prototype.subscribeLoadHistory = function (conv, limit) {
        if (limit === void 0) { limit = 20; }
        if (this.dataService.synced) {
            this.loadFromSQLite(conv, null, limit);
        }
        else {
            this.loadFromServer(conv, null, limit, limit);
        }
        return this.historyExpress;
    };
    DoChatService.prototype.iterateHistory = function (conv, flagDatetime, limit) {
        if (limit === void 0) { limit = 20; }
        console.log('iterateHistory', JSON.stringify(flagDatetime));
        this.loadFromSQLite(conv, flagDatetime, limit);
    };
    DoChatService.prototype.loadFromSQLite = function (conv, flagDatetime, limit, skip) {
        var _this = this;
        if (flagDatetime === void 0) { flagDatetime = null; }
        if (limit === void 0) { limit = 20; }
        if (skip === void 0) { skip = 0; }
        var sqlSub = Observable.fromPromise(this.dataService.queryMessage(SharedService.clientId, conv.id, flagDatetime, limit, skip))
            .forEach(function (sqlResult) {
            console.log('sqlResult', JSON.stringify(sqlResult), sqlResult.value.length);
            var realSize = sqlResult.value.length;
            var sqlMessages = sqlResult.value;
            // sql 与服务端返回的顺序不一样,sqlMessages[0] 代表最新的一条,sqlMessages[realSize] 是较早前的一条
            // 因此在分配批次以及批次内的顺序之前，应该给 sqlMessages 按照时间顺序排序
            sqlMessages = sqlMessages.sort(function (a, b) {
                return a.timestamp.getTime() - b.timestamp.getTime();
            });
            sqlMessages.forEach(function (sqlMessage, i, a) {
                _this.prettifyMessage(null, sqlMessage).forEach(function (prettyMessage) {
                    _this.wrapDoMessage(1, i, limit, limit, prettyMessage);
                });
            });
            if (realSize < limit) {
                _this.loadFromServer(conv, flagDatetime, limit, limit - realSize);
            }
        });
    };
    DoChatService.prototype.loadFromServer = function (conv, flagDatetime, limit, need) {
        var _this = this;
        if (flagDatetime === void 0) { flagDatetime = null; }
        if (limit === void 0) { limit = 20; }
        if (need === void 0) { need = 20; }
        console.log('loadFromServer', JSON.stringify(flagDatetime), limit, need);
        var iterator = conv.createMessagesIterator({ limit: need, beforeTime: flagDatetime });
        var sub = Observable.fromPromise(iterator.next()).forEach(function (serverResult) {
            console.log('serverResult', JSON.stringify(serverResult), serverResult.value.length);
            var realSize = serverResult.value.length;
            var fixedLimit = realSize + limit - need;
            if (serverResult.done && realSize == 0) {
                _this.historyExpress.next({
                    fixedLimit: -1,
                });
            }
            else {
                serverResult.value.forEach(function (historyMessage, i, a) {
                    _this.localStorage.next(historyMessage);
                    _this.prettifyMessage(historyMessage, null).forEach(function (prettyMessage) {
                        _this.wrapDoMessage(1, i + need, limit, fixedLimit, prettyMessage);
                    });
                });
            }
        });
        return Observable.fromPromise(iterator.next());
    };
    DoChatService.prototype.beginSyncWithServer = function () {
    };
    DoChatService.prototype.startLoadHistory = function (conv, limit, skip) {
        if (limit === void 0) { limit = 20; }
        if (skip === void 0) { skip = 0; }
        this.loadFromSQLite(conv, null, limit, skip);
        // let iterator = conv.createMessagesIterator({ limit: limit });
    };
    DoChatService.prototype.wrapDoMessage = function (batchNumber, batchIndex, batchLimit, fixedLimit, prettyMessage) {
        var controlFlowPayload = {};
        controlFlowPayload.batchNumber = batchNumber;
        controlFlowPayload.batchIndex = batchIndex;
        controlFlowPayload.batchLimit = batchLimit;
        controlFlowPayload.fixedLimit = fixedLimit;
        controlFlowPayload.product = prettyMessage;
        this.historyControlFlow.next(controlFlowPayload);
    };
    // controlFlowFactory(limit: number = 20, batchNumber: number) {
    //   let nextDeliver = { limit: limit, batchNumber: batchNumber, nextIndex: 0 };
    //   let inventoryBuffer: Array<{ batchNumber?: number, batchIndex?: number, batchLimit?: number, product?: OrgeMessage }> = [];
    //   this.historyControlFlow.forEach(flowPayload => {
    //     this.historyExpress.next(flowPayload);
    //     // let warehouseFlag = { overwrap: flowPayload, flag: nextDeliver };
    //     // if (flowPayload.batch == nextDeliver.batchNumber && flowPayload.tag == nextDeliver.nextIndex) {
    //     //   nextDeliver.nextIndex++;
    //     //   console.log('from factory', JSON.stringify(flowPayload.product));
    //     //   return this.historyExpress.next(flowPayload.product);
    //     // } else {
    //     //   console.log('put in warehouse', JSON.stringify(flowPayload.product));
    //     //   inventoryBuffer.push(flowPayload);
    //     //   inventoryBuffer = inventoryBuffer.sort((a, b) => {
    //     //     let x = b.batch - a.batch;
    //     //     if (x == 0)
    //     //       return b.tag - a.tag;
    //     //     return x;
    //     //   });
    //     //   if (inventoryBuffer.length > 0) {
    //     //     while (true) {
    //     //       let expressChecker = inventoryBuffer[0] || null;
    //     //       if (expressChecker) {
    //     //         if (expressChecker.batch == nextDeliver.batchNumber && expressChecker.tag == nextDeliver.nextIndex) {
    //     //           console.log('from warehouse', JSON.stringify(expressChecker.product));
    //     //           this.historyExpress.next(expressChecker.product);
    //     //           inventoryBuffer.pop();
    //     //           nextDeliver.nextIndex++;
    //     //         } else {
    //     //           break;
    //     //         }
    //     //       } else {
    //     //         break;
    //     //       }
    //     //     }
    //     //   }
    //     // }
    //     // if (nextDeliver.nextIndex + inventoryBuffer.length >= limit) {
    //     //   let expressChecker = inventoryBuffer[0] || null;
    //     //   while (inventoryBuffer.length > 0) {
    //     //     this.historyExpress.next(expressChecker.product);
    //     //     inventoryBuffer.pop();
    //     //   }
    //     // }
    //     //this.historyWarehouse.next(warehouseFlag);
    //   });
    // }
    DoChatService.prototype.prettifyMessage = function (message, sqlMessage) {
        var from = message == null ? sqlMessage.from : message.from;
        return this.userService.getFriend(from).map(function (sender) {
            var orgeMessage = new DoMessage(message, sqlMessage, sender);
            orgeMessage.fromMe = SharedService.client.id == sender.clientId;
            return orgeMessage;
        });
    };
    DoChatService.prototype.orgeMessageFactory = function (message, sqlMessage, nextFactory) {
        var from = message == null ? sqlMessage.from : message.from;
        return this.userService.getFriend(from).forEach(function (sender) {
            var orgeMessage = new DoMessage(message, sqlMessage, sender);
            orgeMessage.fromMe = SharedService.client.id == sender.clientId;
            nextFactory.next(orgeMessage);
            return orgeMessage;
        });
    };
    DoChatService.prototype.operationMessageFactory = function (message) {
        var _this = this;
        return this.userService.getFriend(message.from).forEach(function (sender) {
            var opMessage = new DoOperationMessage(message, sender);
            _this.operatioStream.next(opMessage);
        });
    };
    DoChatService.prototype.wrapAVMessage = function (message) {
        var json = JSON.parse(JSON.stringify(message));
        if (message.transient) {
            if (json._lctype == -1)
                return this.operationMessageFactory(message);
        }
        else {
            this.localStorage.next(message);
            return this.orgeMessageFactory(message, null, this.wrapMessageStream);
        }
    };
    DoChatService.prototype.sendMessage = function (conv, message) {
        var _this = this;
        var sub = Observable.fromPromise(conv.send(message)).forEach(function (post) {
            _this.sendMessageStream.next(post);
            _this.wrapAVMessage(post);
        });
        return sub;
    };
    DoChatService.prototype.sendOperationMessage = function (conv, op) {
        var opMessage = new TextMessage();
        opMessage.attributes = { op: op };
        // 设置该条消息为暂态消息
        opMessage.setTransient(true);
        ;
        var sub = Observable.fromPromise(conv.send(opMessage));
        return sub;
    };
    DoChatService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DoChatService.ctorParameters = [
        { type: Http, },
        { type: Events, },
        { type: DoUserService, },
        { type: DoDataService, },
    ];
    return DoChatService;
}());
// @messageType(91)
// @messageField('op')
// export class OperationMessage extends TypedMessage {
// }
export var DoOperationMessage = (function () {
    function DoOperationMessage(avMessage, sender) {
        var json = JSON.parse(JSON.stringify(avMessage));
        this.op = json._lcattrs.op;
        this.from = avMessage.from || null;
        var doFriend = new DoFriend(sender);
        this.convId = avMessage.cid;
        this.receivedAt = avMessage.timestamp || avMessage.deliveredAt || new Date();
        this.fromNameText = doFriend.getNameText();
    }
    return DoOperationMessage;
}());
export var DoMessage = (function () {
    function DoMessage(avMessage, sqlMessage, sender) {
        if (avMessage != null) {
            this.from = avMessage.from || null;
            if (avMessage instanceof TextMessage) {
                this.text = avMessage.getText();
            }
            this.convId = avMessage.cid;
            this.receivedAt = avMessage.timestamp || avMessage.deliveredAt || new Date();
        }
        if (sqlMessage != null) {
            this.from = sqlMessage.from || null;
            this.text = sqlMessage.text;
            this.convId = sqlMessage.cid;
            this.receivedAt = sqlMessage.timestamp;
        }
        var doFriend = new DoFriend(sender);
        this.fromNameText = doFriend.getNameText();
        this.avatar = doFriend.getAvatar();
        this.hasAvatar = doFriend.hasAvatar();
    }
    return DoMessage;
}());
export var Message = (function () {
    function Message(obj) {
        this.id = obj.id;
        this.from = obj.from || null;
        this.isRead = obj.isRead || false;
        this.avatar = obj.avatar || null;
        this.text = obj.text || null;
        this.image = obj.image || null;
        this.fromMe = obj.fromMe || null;
        this.fromNameText = obj.fromNameText || null;
    }
    return Message;
}());
