import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import AV from 'leancloud-storage';
import { Realtime, IMClient, Message, Conversation, TextMessage, MessagePriority } from 'leancloud-realtime';
import moment from 'moment';
import { lcGlobal, SharedService } from '../lc-global';
import { MessageProvider } from '../cache/MessageProvider';
import { NgZone } from '@angular/core';
import { DoConversation } from '../do-conversation-list/do-conversation-item';
import { DoDataService } from '../../providers/data-service';
import { Observable, Subject, Observer } from 'rxjs';
import { DoChatService } from '../../providers/chat-service';

@Component({
  selector: 'do-conversation-list',
  templateUrl: 'do-conversation-list.html',
})

export class DoConversationList {
  currentClientId: any;
  zone: NgZone;
  cacheProvider: MessageProvider;
  @Input()
  set clientId(clientId: string) {
    this.currentClientId = clientId;
    this.cacheProvider = new MessageProvider();
    this.initList();
  }
  @Output() convClicked = new EventEmitter<{ id: string, name: string }>();

  @Output() onUnreadNoticed = new EventEmitter<{ notice: string }>();
  pinnedItems: Array<DoConversation>;
  //currentClient: AVIMClient;
  items: Array<DoConversation>;
  obsConvs: Observable<DoConversation>;
  constructor(public events: Events,
    public viewCtrl: ViewController,
    public dataService: DoDataService) {
    this.items = [];
    this.events.subscribe('lc:send', (sendEventData) => {
      this.send(sendEventData[0]);
    });
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  initList() {
    // let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });
    // realtime.createIMClient(this.currentClientId).then(imClient => {
    //   //this.avIMClient = imClient;
    //   SharedService.client = imClient;
    //   SharedService.client.on('message', (message: Message, conversation: Conversation) => {
    //     let eventName: string = 'lc:received:' + conversation.id;
    //     // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
    //     if (lcGlobal.realtime_config.localCache) {
    //       this.cacheProvider.getProvider(this.currentClientId).push(message, conversation);
    //     }
    //     console.log('Message received: ', message.id, message.type, JSON.stringify(message), eventName);
    //     if (message.cid != SharedService.currentConv) {
    //       this.onBadgeEmit(1);
    //     }
    //     this.updateLastMessage(this.items, message);
    //     this.events.publish(eventName, message);
    //     this.events.publish('onMessage', message);
    //   });

    this.events.subscribe('lc_conv_opened', (data) => {
      let conv: Conversation = data[0];
      console.log('onConvOpend', conv.id);
      this.appendConv(conv, null, 0);
    });

    //   return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
    // }).then(cons => {
    //   this.zone.run(() => {
    //     cons = cons.sort(this.sortByUpdatedAt);
    //     cons.forEach((v, i, a) => {
    //       this.extractConv(v).then(exConv => {
    //         this.items.push(exConv);
    //       });
    //     });
    //   });
    // }).catch(error => {
    //   console.log(error.stack);
    // });

    /// obs research
    let realtime = new Realtime({ appId: lcGlobal.leancloud.appId, region: 'cn' });

    this.obsConvs = new Observable<DoConversation>((observer: Observer<DoConversation>) => {
      realtime.createIMClient(this.currentClientId).then(imClient => {
        SharedService.client = imClient;
        SharedService.client.on('membersjoined', this.onJoinedConversation);
        SharedService.client.on('message', (message: Message, conversation: Conversation) => {

          // 检查是否开启了本地缓存聊天记录的选择，如果开启则记录在本地
          if (lcGlobal.realtime_config.localCache) {
            this.cacheProvider.getProvider(this.currentClientId).push(message, conversation);
          }
          console.log('Message received: ', message.id, message.type, JSON.stringify(message));
          if (message.cid != SharedService.currentConv) {
            this.onBadgeEmit(1);
          }
          this.updateLastMessage(this.items, message);
          this.appendConv(conversation, message, 1);

          this.events.publish('onMessage', message);
          this.events.publish('onRXMessage', message);
        });
        return SharedService.client.getQuery().withLastMessagesRefreshed(true).find();
      }).then(cons => {
        let done = 0;
        cons.forEach((v, i, a) => {
          this.extractConv(v, null, 0).then(exConv => {
            observer.next(exConv);
            done++;
            if (done == a.length) {
              observer.complete();
            }
          });
        });
      });
    });
    let subscription = this.obsConvs.forEach(v => {
      this.items.push(v);
    }).then(() => {
      this.items = this.items.sort(this.sortByUpdatedAt);
    });
  }
  sortByUpdatedAt(a, b) {
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  }
  extractConv(v: Conversation, msg: Message, unreadBadge) {
    let rtnModel = new DoConversation();
    let text = '';
    let from = '';
    if (msg) {
      v.lastMessage = msg;
    }
    let receivedAt = v.lastMessageAt || new Date('1970-01-01');
    if (v.lastMessage) {
      from = v.lastMessage.from;
      if (v.lastMessage instanceof TextMessage) {
        text = v.lastMessage.getText();
      }
    }
    let lastMessage = v.lastMessage ? { from: from, text: text, receivedAt: receivedAt } : null;

    let name = v.name || '';
    let type = v.get('type') || '';
    if (type == 'private') {
      let friendIds = v.members.filter((m, i, a) => {
        return m != SharedService.clientId;
      });
      console.log('v.members', v.members);
      let friendId = friendIds[0] || '';
      let makedNameArray: string[] = v.get('markedName') || [];
      let index = makedNameArray.indexOf(SharedService.clientId);
      if (index > -1) {
        let markedName = makedNameArray[index + 1] || '';
        if (markedName.length > 1) {
          name = markedName;
        }
      }
      return this.dataService.getFriendById(SharedService.clientId, friendId).then(friend => {
        let avatar = '';
        if (friend != null) {
          avatar = friend.avatar;
        }
        if (name.length == 0) name = friendId;
        if (lastMessage) {
          return this.dataService.getFriendById(SharedService.clientId, lastMessage.from).then(lastSender => {
            if (lastSender != null) {
              if (lastSender.markName && lastSender.markName.length > 0)
                lastMessage.from = lastSender.markName;
              else if (lastSender.nickName && lastSender.nickName.length > 0) {
                lastMessage.from = lastSender.nickName;
              }
            }
            rtnModel = {
              id: v.id,
              name: name,
              lastMessage: lastMessage,
              unreadBadge: unreadBadge,
              titleImg: avatar,
              updatedAt: v.updatedAt
            };
            return rtnModel;
          });
        } else {
          rtnModel = {
            id: v.id,
            name: name,
            lastMessage: lastMessage,
            unreadBadge: unreadBadge,
            titleImg: avatar,
            updatedAt: v.updatedAt
          };
          return rtnModel;
        }
      });
    } else {
      if (lastMessage) {
        return this.dataService.getFriendById(SharedService.clientId, lastMessage.from).then(friend => {
          if (friend != null) {
            if (friend.markName && friend.markName.length > 0)
              lastMessage.from = friend.markName;
            else if (friend.nickName && friend.nickName.length > 0) {
              lastMessage.from = friend.nickName;
            }
          }
          rtnModel = {
            id: v.id,
            name: name,
            lastMessage: lastMessage,
            unreadBadge: unreadBadge,
            updatedAt: v.updatedAt
          };
          return rtnModel;
        });
      }
      else {
        return new Promise(resolve => {
          rtnModel = {
            id: v.id,
            name: name,
            lastMessage: lastMessage,
            unreadBadge: unreadBadge,
            updatedAt: v.updatedAt
          };
          resolve(rtnModel);
        });
      }
    }
  }

  removeElement<T>(a: Array<T>, el: T) {
    let index = a.indexOf(el);
    if (index > -1) {
      return a.splice(index - 1, 1);
    } else {
      return a;
    }
  }

  onJoinedConversation(payload, conversation: Conversation) {
    console.log('onJoinedConversation', JSON.stringify(payload), conversation.id);
  }

  onConversationItemClick(event, item) {
    this.onBadgeEmit(-item.unreadBadge);
    item.unreadBadge = 0;
    this.convClicked.emit({ id: item.id, name: item.name });
  }
  onBadgeEmit(payload: number) {
    SharedService.unreadBadge += payload;
    this.events.publish('messageBadge', SharedService.unreadBadge);
  }

  send(sendEventData) {
    let convIdStr: string = sendEventData.id;
    SharedService.client.getConversation(convIdStr, true).then(conv => {
      let txtMessage = new TextMessage(sendEventData.text);
      //conv.send(txtMessage, { priority: MessagePriority.HIGH });
      return conv.send(txtMessage);
    }).then(message => {
      this.updateLastMessage(this.items, message);
      this.events.publish('lc:sent:' + convIdStr, message);
      this.events.publish('onMessage', message);
    }).catch(reason => {
      console.log('error:', reason.stack);
    });
  }

  getMessageHistroyFromServer(convId, pIndex, pSize) {
    let convIdStr: string = convId;
    SharedService.client.getConversation(convIdStr, true).then(conv => {
    });
  }

  updateLastMessage(convArray: Array<DoConversation>, message) {
    let checker = convArray || [];
    if (checker.length < 1) return;
    this.zone.run(() => {
      let text = '';
      if (message instanceof TextMessage) {
        text = message.getText();
      } else {
        text = '';
      }
      let targets = convArray.filter(conv => {
        return conv.id == message.cid;
      });
      if (targets.length < 1) return;
      let v = targets[0];
      let currentIndex = convArray.indexOf(v);
      if (message.cid != SharedService.currentConv) {
        if (v.unreadBadge) {
          v.unreadBadge += 1;
        } else {
          v.unreadBadge = 1;
        }
      }
      if (v.lastMessage == null) v.lastMessage = {};
      v.lastMessage.text = text;
      v.updatedAt = new Date();
      convArray.splice(currentIndex, 1);
      convArray.splice(0, 0, v);
      if (message) {
        this.dataService.getFriendById(SharedService.clientId, message.from).then(sender => {
          console.log('v', JSON.stringify(v), 'sender', JSON.stringify(sender));
          v.lastMessage.from = message.from;
          if (sender != null) {
            if (sender.markName && sender.markName.length > 0)
              v.lastMessage.from = sender.markName;
            else if (sender.nickName && sender.nickName.length > 0) {
              v.lastMessage.from = sender.nickName;
            }
          }
        });
      }
    });
  }

  appendConv(conv: Conversation, msg: Message, unreadBadge) {
    this.zone.run(() => {
      let duplicateChecker = this.items.filter(item => {
        return item.id == conv.id;
      });
      if (duplicateChecker.length == 0) {
        this.extractConv(conv, msg, unreadBadge).then(exConv => {
          this.items.splice(0, 0, exConv);
        });
      }
    });
  }
}
