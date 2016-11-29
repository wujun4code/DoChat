import { IMClient } from 'leancloud-realtime';
export declare var lcGlobal: {
    leancloud: {
        appId: string;
        region: string;
        publicConId: string;
    };
    realtime_config: {
        localCache: boolean;
    };
    version: string;
};
export declare class SharedService {
    static client: IMClient;
    static clientId: string;
    static currentConv?: string;
    static unreadBadge: number;
    static noticeText?: string;
    static getNoticText(): string;
}
