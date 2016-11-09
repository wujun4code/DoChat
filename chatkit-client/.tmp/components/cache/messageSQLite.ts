import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { IMessage } from './IMessage';
import { SQLite } from 'ionic-native';
import { Message, Conversation } from 'leancloud-realtime';

@Injectable()
export class MessageSQLite implements IMessage {
    public database: SQLite;
    currentClientId: string;
    constructor(clientId: string) {
        this.init(clientId);
    }
    init(clientId) {
        this.currentClientId = clientId;
        this.database = new SQLite();
        console.log('init(clientId)', clientId);
        this.database.openDatabase({
            name: clientId + '.db',
            location: "default"
        }).then(() => {
            this.database.executeSql("CREATE TABLE IF NOT EXISTS message (id INTEGER PRIMARY KEY AUTOINCREMENT, lcConvId VARCHAR(128), lcMsgId VARCHAR(128), lcType INT, lcFrom VARCHAR(512)), lcTo VARCHAR(512), lcContent TEXT, lcImageUrl VARCHAR(1024), lcDate TEXT", {}).then((data) => {
                console.log("TABLE CREATED: ", data);
            }, (error) => {
                console.error("Unable to execute sql", error);
            })
        }, (error) => {
            console.error("Unable to open database", JSON.stringify(error));
        });
    }

    push(message: Message, conversation: Conversation): Promise<string> {
        let lcConvId = conversation.id;
        let lcMsgId = message.id;
        let lcType = -1;//message.type,目前仅支持文本消息缓存，等待存储 sdk 支持最新版本的 rollup 打包，考虑引入多媒体文件
        let lcFrom = message.from;
        let lcTo = this.currentClientId;
        let lcContent = JSON.stringify(message.toJSON());
        let lcDate = message.deliveredAt.toLocaleString();
        return this.database.executeSql("INSERT INTO message (lcConvId, lcMsgId,lcType,lcFrom,lcTo,lcContent,lcDate) VALUES ('Nic', 'Raboy')", []).then(data => {
            console.log("INSERTED: " + JSON.stringify(data));
            return 'dddd';
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
            return 'error';
        });
    }
    query(convId: string): Promise<Array<{
        text?: string,
        imageUrl?: string,
        date?: Date,
        from?: string,
    }>> {
        return null;
    }

}