import { EventEmitter } from '@angular/core';
import { Events } from 'ionic-angular';
export declare class DoConversationItem {
    events: Events;
    hasImage: boolean;
    hasLastMessage: boolean;
    conv: DoConversation;
    convItem: DoConversation;
    constructor(events: Events);
    convItemClicked: EventEmitter<{
        id: string;
        name: string;
    }>;
    onConversationItemClick(item: any): void;
    ngOnInit(): void;
}
export declare class DoConversation {
    id: string;
    name: string;
    lastMessage?: {
        text?: string;
        receivedAt?: Date;
        from?: string;
    };
    unreadBadge?: number;
    lastOpenedAt?: Date;
    updatedAt?: Date;
    titleImg?: string;
    pattern?: number;
}
