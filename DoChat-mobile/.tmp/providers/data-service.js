import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';
import { TextMessage } from 'leancloud-realtime';
import * as moment from 'moment';
export var Friend = (function () {
    function Friend() {
    }
    return Friend;
}());
export var SqlMessage = (function () {
    function SqlMessage(obj) {
        if (obj) {
            this.id = obj.id;
            this.cid = obj.cid;
            this.from = obj.fromId;
            if (typeof obj.timestamp === "string") {
                this.timestamp = moment(obj.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
            }
            else {
                this.timestamp = obj.timestamp;
            }
            this.type = obj.type;
            this.text = obj.lcText;
            this.mediaPath = obj.mediaPath;
        }
    }
    return SqlMessage;
}());
export var DoDataService = (function () {
    function DoDataService(http, platform) {
        this.http = http;
        this.platform = platform;
        this.cacheMessage = [];
    }
    DoDataService.prototype.purify = function (seftId) {
        if (this.friends != null) {
            var purifyFilter = this.friends.filter(function (f, i, a) {
                return f.clientId != seftId;
            });
            return purifyFilter;
        }
        return this.friends;
    };
    DoDataService.prototype.getFriends = function (seftId, purify) {
        var _this = this;
        if (this.friends) {
            if (purify)
                return Promise.resolve(this.purify(seftId));
            return Promise.resolve(this.friends);
        }
        return new Promise(function (resolve) {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            _this.http.get('assets/json/friends.json').subscribe(function (res) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                _this.friends = res.json();
                if (purify)
                    resolve(_this.purify(seftId));
                resolve(_this.friends);
            });
        });
    };
    DoDataService.prototype.getFriendById = function (seftId, clientId) {
        return this.getFriends(seftId, false).then(function (friends) {
            var fnds = friends.filter(function (v) {
                return v.clientId == clientId;
            });
            if (fnds.length > 0)
                return fnds[0];
            else
                return null;
        });
    };
    DoDataService.prototype.initSql = function (clientId) {
        var _this = this;
        if (this.db)
            return Promise.resolve(this.db);
        this.db = new SQLite();
        var dbName = clientId || 'data';
        dbName = dbName + '.db';
        return this.db.openDatabase({
            name: dbName,
            // location:'default',
            iosDatabaseLocation: 'Documents' // the location field is required
        }).then(function () {
            console.log(dbName + ' connected.');
            return _this.db;
        }, function (err) {
            console.error('Unable to execute sql: ', err);
        });
    };
    DoDataService.prototype.excuteSql = function (clientId, sqlStatement, params) {
        var p = params || {};
        return this.initSql(clientId).then(function (db) {
            if (db) {
                return db.executeSql(sqlStatement, p).then(function (s) {
                    return s;
                }, function (err) {
                    console.log('1 failed to excute sql->' + sqlStatement, JSON.stringify(p), JSON.stringify(err));
                    throw err;
                });
            }
            else {
                console.log('can not open db.');
            }
        });
    };
    DoDataService.prototype.createMessageTable = function (clientId) {
        return this.excuteSql(clientId, "CREATE TABLE IF NOT EXISTS Message (\n          id          STRING   PRIMARY KEY,\n          cid         STRING,\n          fromId      STRING,\n          timestamp   DATETIME,\n          type        INT,\n          lcText      TEXT,\n          mediaPath   STRING,\n          metaData    BLOB,\n          tId         STRING,\n          aId         STRING,\n          bId         STRING,\n          dId         STRING,\n          eId         STRING,\n          fId         STRING,\n          gId         STRING,\n          hId         STRING,\n          iId         STRING,\n          jId         STRING,\n          kId         STRING,\n          lId         STRING,\n          mId         STRING\n      );");
    };
    DoDataService.prototype.createConversationTable = function () {
    };
    DoDataService.prototype.saveAVMessage = function (clientId, message) {
        if (this.platform.is('core')) {
            return;
        }
        var lcText = '';
        if (message instanceof TextMessage) {
            lcText = message.getText();
        }
        var dateTime = moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss");
        var contentJSONString = JSON.stringify(message);
        //[message.id, message.cid, message.from, dateTime, message.type, lcText, 'NAN', 'NAN']
        return this.excuteSql(clientId, "INSERT INTO Message (\n                        id,\n                        cid,\n                        fromId,\n                        timestamp,\n                        type,\n                        lcText,\n                        mediaPath,\n                        metaData\n                    )\n                    VALUES (\n                        ?,\n                        ?,\n                        ?,\n                        ?,\n                        ?,\n                        ?,\n                        ?,\n                        ?\n                    );", [message.id, message.cid, message.from, dateTime, message.type, lcText, 'NAN', 'NAN']).then(function (s) {
        }, function (err) {
            console.log('insert Message failed', err);
            throw err;
        });
    };
    DoDataService.prototype.queryMessage = function (clientId, convId, flagDatetime, limit, skip) {
        var _this = this;
        if (flagDatetime === void 0) { flagDatetime = null; }
        if (limit === void 0) { limit = 20; }
        if (skip === void 0) { skip = 0; }
        if (this.platform.is('core')) {
            var x_1 = function () {
                var range = limit;
                var filterValue = [];
                _this.cacheMessage = _this.cacheMessage.sort(function (a, b) {
                    return b.timestamp.getTime() - a.timestamp.getTime();
                });
                var timeFilter = [];
                var skipFilter = [];
                if (flagDatetime != null) {
                    timeFilter = _this.cacheMessage.filter(function (v, i, a) {
                        return v.timestamp.getTime() < flagDatetime.getTime();
                    });
                    if (range > timeFilter.length) {
                        range = timeFilter.length;
                    }
                    filterValue = timeFilter.slice(0, range);
                }
                else {
                    if (range + skip > _this.cacheMessage.length) {
                        range = timeFilter.length - skip;
                    }
                    skipFilter = _this.cacheMessage.slice(skip, range);
                    filterValue = skipFilter;
                }
                return filterValue;
            };
            if (this.cacheMessage.length > 0) {
                var value = x_1();
                return Promise.resolve({ value: value, done: true });
            }
            return new Promise(function (resolve) {
                // We're using Angular Http provider to request the data,
                // then on the response it'll map the JSON data to a parsed JS object.
                // Next we process the data and resolve the promise with the new data.
                _this.http.get('assets/json/bill.json').subscribe(function (res) {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    var dbMessage = res.json();
                    dbMessage.forEach(function (v, i, a) {
                        var sqlMessage = new SqlMessage(v);
                        _this.cacheMessage.push(sqlMessage);
                    });
                    var value = x_1();
                    resolve({ value: value, done: true });
                });
            });
        }
        else {
            var value_1 = [];
            var q = '', p = [];
            var flagDatetimeString = moment(flagDatetime).format("YYYY-MM-DD HH:mm:ss");
            var queryStatementBeforDatetime = "SELECT * FROM  'Message' WHERE cid = ? AND datetime(timestamp) < datetime(?) ORDER BY datetime(timestamp) DESC LIMIT ? OFFSET ?;";
            var queryParamsBeforDatetime = [convId, flagDatetimeString, limit, skip];
            var queryStatement = "SELECT * FROM  'Message' WHERE cid = ? ORDER BY datetime(timestamp) DESC LIMIT ? Offset ?;";
            var queryParams = [convId, limit, skip];
            if (flagDatetime != null) {
                q = queryStatementBeforDatetime;
                p = queryParamsBeforDatetime;
            }
            else {
                q = queryStatement;
                p = queryParams;
            }
            return this.excuteSql(clientId, q, p).then(function (resultSet) {
                console.log('queryMessage', JSON.stringify(resultSet));
                var length = resultSet.rows.length;
                var done = length < limit;
                for (var i = 0; i < length; i++) {
                    var sqlMessage = new SqlMessage(resultSet.rows.item(i));
                    value_1.push(sqlMessage);
                }
                return { value: value_1, done: done };
            });
        }
    };
    DoDataService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DoDataService.ctorParameters = [
        { type: Http, },
        { type: Platform, },
    ];
    return DoDataService;
}());
