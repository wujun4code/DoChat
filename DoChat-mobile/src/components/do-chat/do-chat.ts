import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { TextMessage, Conversation } from 'leancloud-realtime';
import { Events, List, ViewController, NavController, Content, Refresher } from 'ionic-angular';
import { lcGlobal, SharedService } from '../lc-global';
import { NgZone } from '@angular/core';
import { DoChatService, Message, DoMessage, DoOperationMessage } from '../../providers/chat-service';
import { Observable, Subject, Observer } from 'rxjs';
import { DoDataService, Friend } from '../../providers/data-service';
import { DoUserService, DoFriend } from '../../providers/user-service';

@Component({
    selector: 'do-chat',
    templateUrl: 'do-chat.html'
})
export class DoChat implements OnInit, AfterViewInit, AfterContentInit {

    @ViewChild(Content) chatContent: Content;

    @ViewChild(Refresher) refresher: Refresher

    conversationId: string;
    conversationName: string;
    isPrivate: boolean;
    hasAvatar: boolean;
    convTitleImg: string;
    convTitleText: string;
    msgSum: string;
    loadingText: string;
    pullingText: string;
    noMoreRecord: boolean;

    randomLoadingText() {
        if (this.noMoreRecord) return '真的没了，不要再拉了...';
        let rltx = ['正在加载...', '不要催我 - -!...', '快要拉不动了啦~', '快拉出来了，咦？口味有点重'];
        // let rltx = ['不要催我，我这不在给您加载么 \U+1F602'];
        return rltx[Math.floor(Math.random() * rltx.length)];
    };

    @Input()
    friendIds: string[];

    membersInConv: DoFriend[] = [];
    orgeMessages: DoMessage[] = [];

    opMessages: DoOperationMessage[] = [];
    @Input()
    set convId(convId: string) {
        this.conversationId = convId;
    }
    @Input()
    set convName(convName: string) {
        this.conversationName = convName;
    }
    zone: NgZone;
    conv: Conversation;
    @Output() onMsg = new EventEmitter<any>();
    scrollScreen() {
        this.chatContent.scrollToBottom().then(() => {
            return this.chatContent.scrollToBottom();
        }).then(() => {
            return this.chatContent.scrollToBottom();
        });
    }
    constructor(public events: Events,
        public dataService: DoDataService,
        private ref: ChangeDetectorRef,
        public chatService: DoChatService,
        public userService: DoUserService,
        public viewCtrl: ViewController,
        public navCtrl: NavController) {

        this.zone = new NgZone({ enableLongStackTrace: false });

        this.viewCtrl.willLeave.subscribe(this.willLeave);

        this.loadingText = '正在加载...';
        this.pullingText = '下拉获取更多...';
    }
    ngOnInit() {
        this.initConv().then(conv => {
            this.conv = conv;
            this.friendIds = this.conv.members.filter((v, i, a) => {
                return v != SharedService.clientId;
            });

            this.isPrivate = conv.get('type') == 'private';
            if (!this.isPrivate) {
                this.convTitleText = conv.name;
            }

            SharedService.currentConv = conv.id;
            this.conversationId = conv.id;

            this.userService.getDoFriendByIds(this.friendIds).forEach(next => {
                if (this.isPrivate) {
                    let doFriend = next;
                    this.hasAvatar = doFriend.hasAvatar();
                    this.convTitleImg = doFriend.getAvatar();
                    this.convTitleText = doFriend.getNameText();
                }
            });


            let inventoryBuffer: Array<{ batchNumber?: number, batchIndex?: number, batchLimit?: number, product?: DoMessage }> = [];
            let down = true;
            this.chatService.subscribeLoadHistory(conv).forEach(next => {
                if (next.fixedLimit < 0) {
                    this.noMoreRecord = true;
                    this.pullingText = '没有更多记录了...';
                    this.zone.run(() => {
                        this.refresher.complete();
                    });
                    inventoryBuffer = [];
                    return;
                }
                inventoryBuffer.push(next);
                let fixedLimit = next.fixedLimit;

                if (inventoryBuffer.length >= fixedLimit) {
                    inventoryBuffer = inventoryBuffer.sort((a, b) => {
                        let bx = a.batchNumber - b.batchNumber;
                        if (bx != 0) return bx;
                        return a.batchIndex - b.batchIndex;
                    }).map((t, i, arr) => {
                        t.product.isInPrivateConv = this.isPrivate;
                        return t;
                    });
                    this.zone.run(() => {
                        if (down) {
                            this.orgeMessages = this.orgeMessages.concat(inventoryBuffer.map((v, i, a) => {
                                return v.product;
                            }));
                            this.scrollScreen();
                            down = false;
                        } else {
                            // let temp = inventoryBuffer.map((v, i, a) => {
                            //     return v.product;
                            // });
                            // inventoryBuffer.forEach((v, i, a) => {
                            //     this.orgeMessages.splice(0, 0, v.product);
                            // });
                            while (inventoryBuffer.length > 0) {
                                let ib = inventoryBuffer.pop();
                                this.orgeMessages.splice(0, 0, ib.product);
                            }
                        }
                        this.refresher.complete();
                    });
                    inventoryBuffer = [];
                }
            });
            this.chatService.subscribeOnMessage(this.conv).forEach(next => {
                this.zone.run(() => {
                    next.isInPrivateConv = this.isPrivate;
                    this.orgeMessages.push(next);
                });
                this.scrollScreen();
                this.onMsg.emit(next);
            });

            this.chatService.operatioStream.forEach(next => {
                if (next.convId == this.conv.id) {
                    let duplicateChecker = this.opMessages.find(v => {
                        return v.from == next.from;
                    });
                    if (duplicateChecker) {
                        duplicateChecker.op = next.op;
                    }
                    else {
                        this.opMessages.push(next);
                    }
                }
            });
        });
    }

    initConv(): Promise<Conversation> {
        let convIdChecker = this.conversationId || '';
        if (convIdChecker.length > 0) {
            return SharedService.client.getConversation(this.conversationId, true);
        } else {
            let convName = this.friendIds.length > 1 ? this.conversationName : '';
            let type = this.friendIds.length > 1 ? 'group' : 'private';

            return SharedService.client.createConversation({
                members: this.friendIds,
                unique: true,
                transient: false,
                name: convName,
                markedName: [SharedService.clientId, this.conversationName],
                type: type
            }).then(conv => {
                console.log('conv', conv.members);
                this.events.publish('lc_conv_opened', conv);
                console.log('conv.then', conv.members);
                return conv;
            }).catch(error => {
                console.log(error.stack)
            });
        }
    }

    doRefresh(refresher) {
        // this.loadLatest().then(d => {
        //     refresher.complete();
        // });
        this.loadingText = this.randomLoadingText();
        if (!this.noMoreRecord) {
            let head = this.orgeMessages[0];
            let tail = this.orgeMessages[this.orgeMessages.length - 1];
            if (this.orgeMessages.length > 0) {
                let flagDatetime = head.receivedAt;
                this.chatService.iterateHistory(this.conv, flagDatetime);
            }
        }
        else {
            setTimeout(() => {
                refresher.complete();
            }, 500);
        }

    }

    doStart(refresher) {
        console.log('Refresher, start');
    }

    doPulling(refresher: Refresher) {
        console.log('Pulling', refresher.progress);
    }
    ngAfterViewInit() {
        console.log('AfterViewInit', this.conversationId, this.conversationName);
    }

    ngAfterContentInit() {
        console.log('AfterContentInit', this.conversationId, this.conversationName);
    }
    willLeave() {
        SharedService.currentConv = '';
    }
}