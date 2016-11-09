import { EventEmitter } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';
export declare class LCConversationList {
    private ref;
    events: Events;
    currentClientId: any;
    zone: NgZone;
    cacheProvider: MessageProvider;
    clientId: string;
    convClicked: EventEmitter<{
        id: string;
        name: string;
    }>;
    items: Array<{
        id: string;
        name: string;
        lastMessage?: {
            text?: string;
            receivedAt?: Date;
            from?: string;
        };
    }>;
    constructor(ref: ChangeDetectorRef, events: Events);
    initList(): void;
    onConversationItemClick(conv: any): void;
    send(sendEventData: any): void;
    getMessageHistroyFromServer(convId: any, pIndex: any, pSize: any): void;
    updateLastMessage(message: any): void;
}
