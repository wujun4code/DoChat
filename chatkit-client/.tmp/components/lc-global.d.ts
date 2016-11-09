/// <reference types="leancloud-realtime" />
import { IMClient } from 'leancloud-realtime';
export declare var lcGlobal: {
    leancloud: {
        appId: string;
        appKey: string;
        region: string;
        publicConId: string;
    };
    realtime_config: {
        localCache: boolean;
    };
};
export declare class SharedService {
    static client: IMClient;
    static clientId: string;
}
