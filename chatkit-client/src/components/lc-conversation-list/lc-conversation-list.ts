import { Component, Input } from '@angular/core';

//import { Object as AVObject} from 'leancloud-storage';
import { Realtime, IMClient } from 'leancloud-realtime';
import moment from 'moment';
import { lcGlobal } from '../lc-global'

@Component({
  selector: 'lc-conversation-list',
  templateUrl: 'lc-conversation-list.html'
})
export class LCConversationList {
  @Input() clientId: string;
  //currentClient: AVIMClient;
  items: Array<{
    name: string,
    lastMessage?: { text?: string, receivedAt?: Date, from?: string },
  }>;
  constructor() {
    this.items = [];
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     name: 'Item ' + i
    //   });
    // }
    console.log('lcGlobal', lcGlobal);

    console.log('Hello LCConversationList Component');
    moment().format('HH:mm:ss');
    // let con = new AVObject('GameScore');
    // con.set('xw', 'adsf');
    // con.save();
    this.initList();
  }

  initList() {
    //AVInit({ appId: 'OP1tqDub8FtTygpXpWiyyA26-gzGzoHsz', appKey: 'SvQqnSXAIA8jKq0xyn65F7rB' });
    //let con = new AV.Object('GameScore');
    // con.set('xx', 'ssd');
    // query.find().then(x => {
    //   for (let i = 1; i < 11; i++) {
    //     this.items.push({
    //       name: 'Item ' + i
    //     });
    //   }
    // });
    let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
    realtime.createIMClient(this.clientId).then(imClient => {
      for (let i = 1; i < 11; i++) {
        this.items.push({
          name: 'Item ' + i
        });
      }
      //return imClient.getQuery().withLastMessagesRefreshed(true).find();
    });
  }
}
