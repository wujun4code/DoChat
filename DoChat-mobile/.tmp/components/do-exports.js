import { FromNowPipe } from './util-moment-pipe/util-moment-pipe';
import { StrEqualsPipe } from './util-string-equal-pipe/util-string-equal-pipe';
import { TextImage } from './text-img/text-img';
import { DoInputBox } from './do-input-box/do-input-box';
import { DoChat } from './do-chat/do-chat';
import { DoChatHeader } from './do-chat-header/do-chat-header';
import { DoMssageItem } from './message-item/message-item';
import { DoConversationList } from './do-conversation-list/do-conversation-list';
import { DoConversationItem } from './do-conversation-list/do-conversation-item';
import { DoContactList } from './do-contact-list/do-contact-list';
import { DoContactItem } from './do-contact-list/do-contact-item';
import { DoContactDetail } from './do-contact-list/do-contact-detail';
import { GlobalService } from '../providers/global-service';
import { DoDataService } from '../providers/data-service';
import { DoChatService } from '../providers/chat-service';
import { DoUserService } from '../providers/user-service';
export var pipeInjectables = [
    FromNowPipe,
    StrEqualsPipe
];
export var schemaInjectables = [
    TextImage
];
export var uiInjectables = [
    // 聊天界面
    DoChat,
    DoChatHeader,
    DoMssageItem,
    DoInputBox,
    // 对话列表
    DoConversationList,
    DoConversationItem,
    // 联系人
    DoContactList,
    DoContactItem,
    DoContactDetail
];
export var dataInjectables = [
    GlobalService,
    DoDataService,
    DoChatService,
    DoUserService
];
