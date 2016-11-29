import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject, Observer } from 'rxjs';
import { SQLite } from 'ionic-native';
import { Message as AVMesage, TextMessage } from 'leancloud-realtime';
import * as moment from 'moment';

export class Friend {
  clientId?: string;
  nickName?: string;
  avatar?: string;
  markName?: string;
  isStard?: boolean;
  location?: string;
}
export class SqlMessage {
  id: string;
  cid: string;
  from: string;
  timestamp: Date;
  type: number;
  text: string;
  mediaPath: string;
  constructor(obj: any) {
    if (obj) {

      this.id = obj.id;
      this.cid = obj.cid;
      this.from = obj.fromId;
      if (typeof obj.timestamp === "string") {
        this.timestamp = moment(obj.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
      } else {
        this.timestamp = obj.timestamp;
      }
      this.type = obj.type;
      this.text = obj.lcText;
      this.mediaPath = obj.mediaPath;
    }
  }
}

@Injectable()
export class DoDataService {

  constructor(public http: Http, public platform: Platform) {
  }
  synced: boolean;
  db: SQLite;
  friends: Friend[];
  purify(seftId) {
    if (this.friends != null) {
      let purifyFilter = this.friends.filter((f, i, a) => {
        return f.clientId != seftId;
      });
      return purifyFilter;
      // let purifyChecker = purifyFilter || [];
      // if (purifyChecker.length > 0) {
      //   let seft = purifyChecker[0];
      //   let dirtyIndex = this.friends.indexOf(seft);
      //   this.friends.splice(dirtyIndex, 1);
      // }
    }
    return this.friends;
  }
  getFriends(seftId: string, purify: boolean) {
    if (this.friends) {
      if (purify) return Promise.resolve(this.purify(seftId));
      return Promise.resolve(this.friends);
    }

    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('assets/json/friends.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.friends = res.json();
        if (purify) resolve(this.purify(seftId));
        resolve(this.friends);
      });
    });
  }

  getFriendById(seftId, clientId) {
    return this.getFriends(seftId, false).then(friends => {
      let fnds = friends.filter((v) => {
        return v.clientId == clientId;
      });
      if (fnds.length > 0) return fnds[0];
      else return null;
    });
  }

  initSql(clientId?: string) {
    if (this.db) return Promise.resolve(this.db);
    this.db = new SQLite();

    let dbName = clientId || 'data';
    dbName = dbName + '.db';
    return this.db.openDatabase({
      name: dbName,
      // location:'default',
      iosDatabaseLocation: 'Documents' // the location field is required
    }).then(() => {
      console.log(dbName + ' connected.');
      return this.db;
    }, (err) => {
      console.error('Unable to execute sql: ', err);
    });
  }
  excuteSql(clientId: string, sqlStatement: string, params?: any) {
    let p = params || {};
    return this.initSql(clientId).then(db => {
      if (db) {
        return db.executeSql(sqlStatement, p).then(s => {
          return s;
        }, err => {
          console.log('1 failed to excute sql->' + sqlStatement, JSON.stringify(p), JSON.stringify(err));
          throw err;
        });
      } else {
        console.log('can not open db.');
      }
    });
  }
  createMessageTable(clientId: string) {
    return this.excuteSql(clientId, `CREATE TABLE IF NOT EXISTS Message (
          id          STRING   PRIMARY KEY,
          cid         STRING,
          fromId      STRING,
          timestamp   DATETIME,
          type        INT,
          lcText      TEXT,
          mediaPath   STRING,
          metaData    BLOB,
          tId         STRING,
          aId         STRING,
          bId         STRING,
          dId         STRING,
          eId         STRING,
          fId         STRING,
          gId         STRING,
          hId         STRING,
          iId         STRING,
          jId         STRING,
          kId         STRING,
          lId         STRING,
          mId         STRING
      );`);
  }
  createConversationTable() {

  }
  saveAVMessage(clientId: string, message: AVMesage) {
    if (this.platform.is('core')) {
      return;
    }
    let lcText = '';
    if (message instanceof TextMessage) {
      lcText = message.getText();
    }
    let dateTime = moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss");
    let contentJSONString = JSON.stringify(message);
    //[message.id, message.cid, message.from, dateTime, message.type, lcText, 'NAN', 'NAN']
    return this.excuteSql(clientId, `INSERT INTO Message (
                        id,
                        cid,
                        fromId,
                        timestamp,
                        type,
                        lcText,
                        mediaPath,
                        metaData
                    )
                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    );`, [message.id, message.cid, message.from, dateTime, message.type, lcText, 'NAN', 'NAN']).then(s => {

      }, err => {
        console.log('insert Message failed', err);
        throw err;
      });
  }

  cacheMessage: SqlMessage[] = [];

  queryMessage(clientId: string, convId: string, flagDatetime: Date = null, limit = 20, skip = 0) {
    if (this.platform.is('core')) {
      let x = () => {
        let range = limit;
        let filterValue: Array<SqlMessage> = [];

        this.cacheMessage = this.cacheMessage.sort((a, b) => {
          return b.timestamp.getTime() - a.timestamp.getTime();
        });
        let timeFilter: Array<SqlMessage> = [];
        let skipFilter: Array<SqlMessage> = [];
        if (flagDatetime != null) {

          timeFilter = this.cacheMessage.filter((v, i, a) => {
            return v.timestamp.getTime() < flagDatetime.getTime();
          });
          if (range > timeFilter.length) {
            range = timeFilter.length;
          }
          filterValue = timeFilter.slice(0, range);
        } else {
          if (range + skip > this.cacheMessage.length) {
            range = timeFilter.length - skip;
          }
          skipFilter = this.cacheMessage.slice(skip, range);
          filterValue = skipFilter;
        }
        return filterValue;
      };


      if (this.cacheMessage.length > 0) {
        let value = x();
        return Promise.resolve({ value: value, done: true });
      }

      return new Promise(resolve => {
        // We're using Angular Http provider to request the data,
        // then on the response it'll map the JSON data to a parsed JS object.
        // Next we process the data and resolve the promise with the new data.
        this.http.get('assets/json/bill.json').subscribe(res => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          let dbMessage = res.json();
          dbMessage.forEach((v, i, a) => {
            let sqlMessage = new SqlMessage(v);
            this.cacheMessage.push(sqlMessage);
          });
          let value = x();
          resolve({ value: value, done: true });
        });
      });
    } else {
      let value: SqlMessage[] = [];
      let q = '', p = [];

      let flagDatetimeString = moment(flagDatetime).format("YYYY-MM-DD HH:mm:ss");
      let queryStatementBeforDatetime = `SELECT * FROM  'Message' WHERE cid = ? AND datetime(timestamp) < datetime(?) ORDER BY datetime(timestamp) DESC LIMIT ? OFFSET ?;`
      let queryParamsBeforDatetime = [convId, flagDatetimeString, limit, skip];

      let queryStatement = `SELECT * FROM  'Message' WHERE cid = ? ORDER BY datetime(timestamp) DESC LIMIT ? Offset ?;`;
      let queryParams = [convId, limit, skip];

      if (flagDatetime != null) {
        q = queryStatementBeforDatetime;
        p = queryParamsBeforDatetime;
      }
      else {
        q = queryStatement;
        p = queryParams;
      }
      return this.excuteSql(clientId, q, p).then(resultSet => {
        console.log('queryMessage', JSON.stringify(resultSet));
        let length = resultSet.rows.length;
        let done = length < limit;
        for (let i = 0; i < length; i++) {
          let sqlMessage = new SqlMessage(resultSet.rows.item(i));
          value.push(sqlMessage);
        }
        return { value: value, done: done };
      });
    }
  }

}
