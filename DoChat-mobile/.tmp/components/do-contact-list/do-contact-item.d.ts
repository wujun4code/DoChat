import { EventEmitter } from '@angular/core';
export declare class DoContactItem {
    name: string;
    clientId: string;
    avatar: string;
    constructor();
    friendId: string;
    friendName: string;
    avatarUrl: string;
    contactClicked: EventEmitter<{
        name?: string;
        clientId?: string;
        avatar?: string;
    }>;
    onContactItemClick(event: any): void;
}
