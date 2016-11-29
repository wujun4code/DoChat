import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { Message as AVMesage } from 'leancloud-realtime';
export declare class Friend {
    clientId?: string;
    nickName?: string;
    avatar?: string;
    markName?: string;
    isStard?: boolean;
    location?: string;
}
export declare class SqlMessage {
    id: string;
    cid: string;
    from: string;
    timestamp: Date;
    type: number;
    text: string;
    mediaPath: string;
    constructor(obj: any);
}
export declare class DoDataService {
    http: Http;
    platform: Platform;
    constructor(http: Http, platform: Platform);
    synced: boolean;
    db: SQLite;
    friends: Friend[];
    purify(seftId: any): Friend[];
    getFriends(seftId: string, purify: boolean): Promise<Friend[]>;
    getFriendById(seftId: any, clientId: any): Promise<Friend>;
    initSql(clientId?: string): Promise<SQLite>;
    excuteSql(clientId: string, sqlStatement: string, params?: any): Promise<any>;
    createMessageTable(clientId: string): Promise<any>;
    createConversationTable(): void;
    saveAVMessage(clientId: string, message: AVMesage): Promise<void>;
    cacheMessage: SqlMessage[];
    queryMessage(clientId: string, convId: string, flagDatetime?: Date, limit?: number, skip?: number): Promise<{
        value: SqlMessage[];
        done: boolean;
    }>;
}
