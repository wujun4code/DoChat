import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
export var MessageSQLite = (function () {
    function MessageSQLite(clientId) {
        this.init(clientId);
    }
    MessageSQLite.prototype.init = function (clientId) {
        var _this = this;
        this.currentClientId = clientId;
        this.database = new SQLite();
        console.log('init(clientId)', clientId);
        this.database.openDatabase({
            name: clientId + '.db',
            location: "default"
        }).then(function () {
            _this.database.executeSql("CREATE TABLE IF NOT EXISTS message (id INTEGER PRIMARY KEY AUTOINCREMENT, lcConvId VARCHAR(128), lcMsgId VARCHAR(128), lcType INT, lcFrom VARCHAR(512)), lcTo VARCHAR(512), lcContent TEXT, lcImageUrl VARCHAR(1024), lcDate TEXT", {}).then(function (data) {
                console.log("TABLE CREATED: ", data);
            }, function (error) {
                console.error("Unable to execute sql", error);
            });
        }, function (error) {
            console.error("Unable to open database", JSON.stringify(error));
        });
    };
    MessageSQLite.prototype.push = function (message, conversation) {
        var lcConvId = conversation.id;
        var lcMsgId = message.id;
        var lcType = -1; //message.type,目前仅支持文本消息缓存，等待存储 sdk 支持最新版本的 rollup 打包，考虑引入多媒体文件
        var lcFrom = message.from;
        var lcTo = this.currentClientId;
        var lcContent = JSON.stringify(message.toJSON());
        var lcDate = message.deliveredAt.toLocaleString();
        return this.database.executeSql("INSERT INTO message (lcConvId, lcMsgId,lcType,lcFrom,lcTo,lcContent,lcDate) VALUES ('Nic', 'Raboy')", []).then(function (data) {
            console.log("INSERTED: " + JSON.stringify(data));
            return 'dddd';
        }, function (error) {
            console.log("ERROR: " + JSON.stringify(error.err));
            return 'error';
        });
    };
    MessageSQLite.prototype.query = function (convId) {
        return null;
    };
    MessageSQLite.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MessageSQLite.ctorParameters = [
        null,
    ];
    return MessageSQLite;
}());
