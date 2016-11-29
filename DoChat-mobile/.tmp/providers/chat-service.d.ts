import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject } from 'rxjs';
import { Events } from 'ionic-angular';
import { Message as AVMesage, Conversation } from 'leancloud-realtime';
import { DoUserService } from './user-service';
import { DoDataService, Friend, SqlMessage } from './data-service';
export declare class DoChatService {
    http: Http;
    events: Events;
    userService: DoUserService;
    dataService: DoDataService;
    memberStream: Subject<DoMessage>;
    newMessages: Subject<DoMessage>;
    localStorage: Subject<AVMesage>;
    wrapMessageStream: Subject<DoMessage>;
    sendMessageStream: Subject<AVMesage>;
    operatioStream: Subject<DoOperationMessage>;
    historyControlFlow: Subject<{
        batchNumber?: number;
        batchIndex?: number;
        batchLimit?: number;
        fixedLimit?: number;
        product?: DoMessage;
    }>;
    historyExpress: Subject<{
        batchNumber?: number;
        batchIndex?: number;
        batchLimit?: number;
        fixedLimit?: number;
        product?: DoMessage;
    }>;
    constructor(http: Http, events: Events, userService: DoUserService, dataService: DoDataService);
    subscribeOnMessage(conv: Conversation): Observable<DoMessage>;
    subscribeLoadHistory(conv: Conversation, limit?: number): Subject<{
        batchNumber?: number;
        batchIndex?: number;
        batchLimit?: number;
        fixedLimit?: number;
        product?: DoMessage;
    }>;
    iterateHistory(conv: Conversation, flagDatetime: Date, limit?: number): void;
    loadFromSQLite(conv: Conversation, flagDatetime?: Date, limit?: number, skip?: number): void;
    loadFromServer(conv: Conversation, flagDatetime?: Date, limit?: number, need?: number): Observable<{
        value: AVMesage[];
        done: boolean;
    }>;
    beginSyncWithServer(): void;
    startLoadHistory(conv: Conversation, limit?: number, skip?: number): void;
    wrapDoMessage(batchNumber: any, batchIndex: any, batchLimit: any, fixedLimit: any, prettyMessage: DoMessage): void;
    prettifyMessage(message: AVMesage, sqlMessage: SqlMessage): Observable<DoMessage>;
    orgeMessageFactory(message: AVMesage, sqlMessage: SqlMessage, nextFactory: Subject<DoMessage>): Promise<void>;
    operationMessageFactory(message: AVMesage): Promise<void>;
    wrapAVMessage(message: AVMesage): Promise<void>;
    sendMessage(conv: Conversation, message: AVMesage): Promise<void>;
    sendOperationMessage(conv: Conversation, op: string): Observable<AVMesage>;
}
export declare class DoOperationMessage {
    op: string;
    from: string;
    msgId: string;
    convId: string;
    fromNameText: string;
    receivedAt: Date;
    constructor(avMessage: AVMesage, sender: Friend);
}
export declare class DoMessage {
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
    constructor(avMessage: AVMesage, sqlMessage: SqlMessage, sender: Friend);
}
export declare class Message {
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
    constructor(obj: any);
}
