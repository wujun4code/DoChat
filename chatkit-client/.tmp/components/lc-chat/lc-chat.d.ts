import { EventEmitter } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular';
import { NgZone } from '@angular/core';
export declare class LCChat {
    events: Events;
    private ref;
    conversationId: string;
    conversationName: string;
    msgsInConv: Array<{
        from?: string;
        avatar?: string;
        text?: string;
        image?: string;
        fromMe?: boolean;
    }>;
    messageIterator: any;
    convId: string;
    convName: string;
    zone: NgZone;
    onMsg: EventEmitter<any>;
    constructor(events: Events, ref: ChangeDetectorRef);
}
