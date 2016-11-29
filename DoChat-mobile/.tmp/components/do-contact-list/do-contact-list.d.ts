import { EventEmitter, OnInit } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
export declare class DoContactList implements OnInit {
    dataService: DoDataService;
    staredFriends: Array<{
        name?: string;
        clientId?: string;
        avatar?: string;
    }>;
    friends: Array<{
        name?: string;
        clientId?: string;
        avatar?: string;
    }>;
    ngOnInit(): void;
    constructor(dataService: DoDataService);
    onFriendClicked: EventEmitter<{
        name?: string;
        clientId?: string;
        avatar?: string;
    }>;
    onContactItemClick(friend: any): void;
    popupSearchFriend(event: any): void;
    popupGroupChat(event: any): void;
    popupEditTag(event: any): void;
    popupOfficialAccounts(event: any): void;
}
