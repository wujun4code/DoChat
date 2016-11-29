import { EventEmitter } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
export declare class DoContactDetail {
    dataService: DoDataService;
    clientId: string;
    avatar: string;
    markName: string;
    nickName: string;
    isStared: boolean;
    location: string;
    constructor(dataService: DoDataService);
    ngOnInit(): void;
    clickNavToChat: EventEmitter<{
        clientId?: string;
        markName?: string;
    }>;
    navToSetTags(event: any): void;
    navToChat(event: any): void;
}
