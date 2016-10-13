import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import 'rxjs/add/operator/map';

import { User as AVUser} from 'leancloud-storage';

@Injectable()
export class UserProvider {
  local: Storage;
  constructor(private http: Http) {
    this.local = new Storage(LocalStorage);
  }
  save(user: AVUser) {
    let sessionToken = user.getSessionToken();
    let username = user.getUsername();
    let userId = user.id;

    let userData = {
      'sessionToken': sessionToken,
      'username': username,
      'clientId': userId
    }
    return this.local.setJson('user', userData);
  }
  validate() {
    return this.local.getJson('user').then(userCache => {
      let sessionToken = userCache.sessionToken;
      return AVUser.become<AVUser>(sessionToken).then(user => {
        return true;
      }, error => {
        return false;
      });
    });
  }
}

