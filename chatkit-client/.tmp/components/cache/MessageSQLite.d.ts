/// <reference types="leancloud-realtime" />
import 'rxjs/add/operator/map';
import { IMessage } from './IMessage';
import { SQLite } from 'ionic-native';
import { Message, Conversation } from 'leancloud-realtime';
export declare class MessageSQLite implements IMessage {
    database: SQLite;
    currentClientId: string;
    constructor(clientId: string);
    init(clientId: any): void;
    push(message: Message, conversation: Conversation): Promise<string>;
    query(convId: string): Promise<Array<{
        text?: string;
        imageUrl?: string;
        date?: Date;
        from?: string;
    }>>;
}
