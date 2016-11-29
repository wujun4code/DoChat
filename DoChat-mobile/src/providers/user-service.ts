import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject, Observer } from 'rxjs';
import { DoDataService, Friend } from './data-service';

export class DoFriend {
  metaFriend: Friend;

  constructor(friend: Friend) {
    this.metaFriend = friend;
  }
  getAvatar() {
    return this.metaFriend.avatar || null;
  }

  hasAvatar() {
    return this.metaFriend.avatar && 0 !== this.metaFriend.avatar.length;
  }

  getNameText() {
    let rtn = this.metaFriend.clientId;
    if (this.metaFriend.nickName && this.metaFriend.nickName.length > 0) {
      rtn = this.metaFriend.nickName;
    }
    if (this.metaFriend.markName && this.metaFriend.markName.length > 0) {
      rtn = this.metaFriend.markName;
    }
    return rtn;
  }

}

@Injectable()
export class DoUserService {
  friends: Friend[];
  constructor(public http: Http) {
  }
  
  //doFrinendStream: Subject<DoFriend> = new Subject<DoFriend>();
  getDoFriendByIds(ids: string[]) {
    console.log('ids', ids);
    let doFrinendStream: Subject<DoFriend> = new Subject<DoFriend>();
    ids.forEach(id => {
      this.getFriend(id).forEach(f => {
        let dofri = new DoFriend(f);
        doFrinendStream.next(dofri);
      });
    });
    return doFrinendStream.asObservable();
  }

  getFriends(): Observable<Friend[]> {
    if (this.friends) Observable.fromPromise(new Promise(resolve => {
      resolve(this.friends);
    }));

    return this.http.get('assets/json/friends.json').map(res => {
      this.friends = res.json();
      return this.friends;
    });
  }

  getFriend(clientId: string): Observable<Friend> {
    return this.getFriends().map(friends => {
      let f = friends.find((friend, i, a) => {
        return friend.clientId == clientId;
      });
      if (f == null) {
        f = new Friend();
        f.clientId = clientId;
      }
      //console.log('getFriend', JSON.stringify(f));
      return f;
    });
  }

}
