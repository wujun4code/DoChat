import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject, Observer, Subscription } from 'rxjs';
import { Events, ViewController } from 'ionic-angular';
import { lcGlobal, SharedService } from '../components/lc-global';
import { IMClient, Message as AVMesage, Conversation, TextMessage, TypedMessage } from 'leancloud-realtime';
import { DoUserService, DoFriend } from './user-service';
import { DoDataService, Friend, SqlMessage } from './data-service';

@Injectable()
export class DoChatService {

    memberStream: Subject<DoMessage> = new Subject<DoMessage>();
    newMessages: Subject<DoMessage> = new Subject<DoMessage>();
    localStorage: Subject<AVMesage> = new Subject<AVMesage>();
    wrapMessageStream: Subject<DoMessage> = new Subject<DoMessage>();
    sendMessageStream: Subject<AVMesage> = new Subject<AVMesage>();
    operatioStream: Subject<DoOperationMessage> = new Subject<DoOperationMessage>();
    historyControlFlow: Subject<{
        batchNumber?: number,
        batchIndex?: number,
        batchLimit?: number,
        fixedLimit?: number,
        product?: DoMessage
    }> = new Subject<{ batchNumber?: number, batchIndex?: number, batchLimit?: number, fixedLimit?: number, product?: DoMessage }>();
    historyExpress: Subject<{
        batchNumber?: number,
        batchIndex?: number,
        batchLimit?: number,
        fixedLimit?: number,
        product?: DoMessage
    }> = new Subject<{ batchNumber?: number, batchIndex?: number, batchLimit?: number, fixedLimit?: number, product?: DoMessage }>();



    constructor(public http: Http,
        public events: Events,
        public userService: DoUserService,
        public dataService: DoDataService) {

        this.historyControlFlow.forEach(flowPayload => {
            this.historyExpress.next(flowPayload);
        });

        // 消息送达第一时间送到 wrap 工厂进行包装，将 LeanCloud 封装的消息包装成页面上需要显示的数据
        this.wrapMessageStream.subscribe(this.newMessages);

        // 包装好的消息就通知本地缓存工厂，进行存储
        // this.newMessages.subscribe(this.localStorage);

        this.localStorage.forEach(nextMessage => {
            console.log('begin to local storage', 'engine:sqlite');
            this.dataService.saveAVMessage(SharedService.clientId, nextMessage).then(s => { }, error => {
                //{"code":6,"message":"UNIQUE constraint failed: Message.id"}
                if (error.code == 6 && error.message.indexOf('Message.id') > 0) {
                    this.dataService.synced = true;
                }
            });
        });

        // SharedService.client.on('message', (message: AVMesage, conversation: Conversation) => {
        //   console.log('ChatService.this.refCount',this.refCount);
        //   this.onNewMessage(message);
        // });
        this.events.subscribe('onRXMessage', data => {
            console.log('onRXMessage', data[0], JSON.stringify(data[0]));
            let message = data[0];

            this.wrapAVMessage(message);
        });
    }

    subscribeOnMessage(conv: Conversation) {
        return this.newMessages.map(orgMessage => {
            if (orgMessage.convId == conv.id) {
                return orgMessage;
            }
        });
    }

    subscribeLoadHistory(conv: Conversation, limit: number = 20) {
        if (this.dataService.synced) {
            this.loadFromSQLite(conv, null, limit);
        } else {
            this.loadFromServer(conv, null, limit, limit);
        }
        return this.historyExpress;
    }

    iterateHistory(conv: Conversation, flagDatetime: Date, limit: number = 20) {
        console.log('iterateHistory', JSON.stringify(flagDatetime));
        this.loadFromSQLite(conv, flagDatetime, limit);
    }

    loadFromSQLite(conv: Conversation, flagDatetime: Date = null, limit: number = 20, skip = 0) {
        let sqlSub = Observable.fromPromise(this.dataService.queryMessage(SharedService.clientId, conv.id, flagDatetime, limit, skip))
            .forEach(sqlResult => {
                console.log('sqlResult', JSON.stringify(sqlResult), sqlResult.value.length);
                let realSize = sqlResult.value.length;
                let sqlMessages = sqlResult.value;
                // sql 与服务端返回的顺序不一样,sqlMessages[0] 代表最新的一条,sqlMessages[realSize] 是较早前的一条
                // 因此在分配批次以及批次内的顺序之前，应该给 sqlMessages 按照时间顺序排序
                sqlMessages = sqlMessages.sort((a, b) => {
                    return a.timestamp.getTime() - b.timestamp.getTime();
                });
                sqlMessages.forEach((sqlMessage, i, a) => {
                    this.prettifyMessage(null, sqlMessage).forEach(prettyMessage => {
                        this.wrapDoMessage(1, i, limit, limit, prettyMessage);
                    });
                });
                if (realSize < limit) {
                    this.loadFromServer(conv, flagDatetime, limit, limit - realSize);
                }
            });
    }

    loadFromServer(conv: Conversation, flagDatetime: Date = null, limit = 20, need: number = 20) {
        console.log('loadFromServer', JSON.stringify(flagDatetime), limit, need);
        let iterator = conv.createMessagesIterator({ limit: need, beforeTime: flagDatetime });
        let sub = Observable.fromPromise(iterator.next()).forEach(serverResult => {
            console.log('serverResult', JSON.stringify(serverResult), serverResult.value.length);
            let realSize = serverResult.value.length;
            let fixedLimit = realSize + limit - need;
            if (serverResult.done && realSize == 0) {
                this.historyExpress.next({
                    fixedLimit: -1,
                });
            }
            else {
                serverResult.value.forEach((historyMessage, i, a) => {
                    this.localStorage.next(historyMessage);
                    this.prettifyMessage(historyMessage, null).forEach(prettyMessage => {
                        this.wrapDoMessage(1, i + need, limit, fixedLimit, prettyMessage);
                    });
                });
            }

        });
        return Observable.fromPromise(iterator.next());
    }
    beginSyncWithServer() {

    }

    startLoadHistory(conv: Conversation, limit: number = 20, skip = 0) {
        this.loadFromSQLite(conv, null, limit, skip);
        // let iterator = conv.createMessagesIterator({ limit: limit });

    }

    wrapDoMessage(batchNumber, batchIndex, batchLimit, fixedLimit, prettyMessage: DoMessage) {
        let controlFlowPayload: { batchNumber?: number, batchIndex?: number, batchLimit?: number, fixedLimit?: number, product?: DoMessage } = {};
        controlFlowPayload.batchNumber = batchNumber;
        controlFlowPayload.batchIndex = batchIndex;
        controlFlowPayload.batchLimit = batchLimit;
        controlFlowPayload.fixedLimit = fixedLimit;
        controlFlowPayload.product = prettyMessage;
        this.historyControlFlow.next(controlFlowPayload);
    }

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


    prettifyMessage(message: AVMesage, sqlMessage: SqlMessage) {
        let from = message == null ? sqlMessage.from : message.from;
        return this.userService.getFriend(from).map(sender => {
            let orgeMessage = new DoMessage(message, sqlMessage, sender);
            orgeMessage.fromMe = SharedService.client.id == sender.clientId;
            return orgeMessage;
        });
    }
    orgeMessageFactory(message: AVMesage, sqlMessage: SqlMessage, nextFactory: Subject<DoMessage>) {
        let from = message == null ? sqlMessage.from : message.from;
        return this.userService.getFriend(from).forEach(sender => {

            let orgeMessage = new DoMessage(message, sqlMessage, sender);
            orgeMessage.fromMe = SharedService.client.id == sender.clientId;
            nextFactory.next(orgeMessage);
            return orgeMessage;
        });
    }
    operationMessageFactory(message: AVMesage) {
        return this.userService.getFriend(message.from).forEach(sender => {
            let opMessage = new DoOperationMessage(message, sender);
            this.operatioStream.next(opMessage);
        });
    }

    wrapAVMessage(message: AVMesage) {
        let json = JSON.parse(JSON.stringify(message));
        if (message.transient) {
            if (json._lctype == -1)
                return this.operationMessageFactory(message);
        } else {
            this.localStorage.next(message);
            return this.orgeMessageFactory(message, null, this.wrapMessageStream);
        }

    }

    sendMessage(conv: Conversation, message: AVMesage) {
        let sub = Observable.fromPromise(conv.send(message)).forEach(post => {
            this.sendMessageStream.next(post);
            this.wrapAVMessage(post);
        });
        return sub;
    }
    sendOperationMessage(conv: Conversation, op: string) {
        let opMessage = new TextMessage();
        opMessage.attributes = { op: op };
        // 设置该条消息为暂态消息
        opMessage.setTransient(true);;
        let sub = Observable.fromPromise(conv.send(opMessage));
        return sub;
    }
}
// @messageType(91)
// @messageField('op')
// export class OperationMessage extends TypedMessage {
// }


export class DoOperationMessage {
    op: string;
    from: string;
    msgId: string;
    convId: string;
    fromNameText: string;
    receivedAt: Date;
    constructor(avMessage: AVMesage, sender: Friend) {
        let json = JSON.parse(JSON.stringify(avMessage));
        this.op = json._lcattrs.op;
        this.from = avMessage.from || null;
        let doFriend = new DoFriend(sender);
        this.convId = avMessage.cid;
        this.receivedAt = avMessage.timestamp || avMessage.deliveredAt || new Date();
        this.fromNameText = doFriend.getNameText();
    }
}

export class DoMessage {
    msgId: string;
    convId: string;
    from: string;
    fromMe: boolean;
    avatar: string;
    hasAvatar: boolean;
    text: string;
    fromNameText: string;
    receivedAt: Date;
    isInPrivateConv: boolean;
    constructor(avMessage: AVMesage, sqlMessage: SqlMessage, sender: Friend) {
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


        let doFriend = new DoFriend(sender);
        this.fromNameText = doFriend.getNameText();
        this.avatar = doFriend.getAvatar();
        this.hasAvatar = doFriend.hasAvatar();
    }
}

export class Message {
    id: string;
    from: string;
    isRead: boolean;
    avatar: string;
    text: string;
    image: string;
    audio: string;
    video: string;
    fromMe: boolean;
    fromNameText: string;
    constructor(obj: any) {
        this.id = obj.id;
        this.from = obj.from || null;
        this.isRead = obj.isRead || false;
        this.avatar = obj.avatar || null;
        this.text = obj.text || null;
        this.image = obj.image || null;
        this.fromMe = obj.fromMe || null;
        this.fromNameText = obj.fromNameText || null;
    }
}
