import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subject, Observer } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class LeanEngineReport {
  appId = 'xUOXCvWLYEwMJcayW63c6gHl';
  appKey = 'UtULFu1PWqJHGIK8p1FCjqVt';
  constructor(public http: Http) {
    console.log('Hello LeanEngineReport Provider');
  }

  getByDate(date: Date) {
    let sessionToken = 'cb3unr1hgrqf2hqpbg9gnz8cf';
    let leHeaders = new Headers({
      'X-LC-Id': this.appId,
      'X-LC-Key': this.appKey,
      'Content-Type': 'application/json',
      'X-LC-Session': sessionToken
    });

    let ds = date.toISOString().substring(0, 10).split('-').join('');
    let qst = 'https://leancloud.cn/1.1/classes/DailyArchive?&where=%7B%22date%22%3A%22{0}%22%7D&limit=20&order=-updatedAt';
    let qs = this.format(qst,ds);
    return this.http.get(qs, { headers: leHeaders })
      .map(this.extractData)
      .catch(this.handleError);

  }
  format(qst:string,...items) {
    if (qst.length == 0)
      return null;

    for (var i = 0; i < items.length; i++) {
      var re = new RegExp('\\{' + (i) + '\\}', 'gm');
      qst = qst.replace(re, items[i]);
    }
    return qst;
  }
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
