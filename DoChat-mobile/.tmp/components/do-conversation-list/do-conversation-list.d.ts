import { EventEmitter } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import { Message, Conversation } from 'leancloud-realtime';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';
import { DoConversation } from '../do-conversation-list/do-conversation-item';
import { DoDataService } from '../../providers/data-service';
import { Observable } from 'rxjs';
export declare class DoConversationList {
    events: Events;
    viewCtrl: ViewController;
    dataService: DoDataService;
    currentClientId: any;
    zone: NgZone;
    cacheProvider: MessageProvider;
    clientId: string;
    convClicked: EventEmitter<{
        id: string;
        name: string;
    }>;
    onUnreadNoticed: EventEmitter<{
        notice: string;
    }>;
    pinnedItems: Array<DoConversation>;
    items: Array<DoConversation>;
    obsConvs: Observable<DoConversation>;
    constructor(events: Events, viewCtrl: ViewController, dataService: DoDataService);
    initList(): void;
    sortByUpdatedAt(a: any, b: any): number;
    extractConv(v: Conversation, msg: Message, unreadBadge: any): Promise<DoConversation>;
    removeElement<T>(a: Array<T>, el: T): T[];
    onJoinedConversation(payload: any, conversation: Conversation): void;
    onConversationItemClick(event: any, item: any): void;
    onBadgeEmit(payload: number): void;
    send(sendEventData: any): void;
    getMessageHistroyFromServer(convId: any, pIndex: any, pSize: any): void;
    updateLastMessage(convArray: Array<DoConversation>, message: any): void;
    appendConv(conv: Conversation, msg: Message, unreadBadge: any): void;
}
