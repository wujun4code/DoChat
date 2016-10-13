import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { init as AVInit, Query as AVQuery, User as AVUser, Object as AVObject} from 'leancloud-storage';
import { Realtime as AVRealtime, IMClient as AVIMClient } from 'leancloud-realtime';

@Injectable()
export class ChatService {
  constructor(private http: Http) {
  }
  realtime: AVRealtime;
  client: AVIMClient;
  init(leancloudConfig: any) {
    this.realtime = new AVRealtime({ appId: leancloudConfig.appId, region: 'cn' });
    return this.realtime.createIMClient(AVUser.current().getUsername()).then(imClient => {
      this.client = imClient;
      return imClient.getConversation(leancloudConfig.publicConId);
    }).then(con => {
      return con.join();
    }).catch(console.error);
  }
}
