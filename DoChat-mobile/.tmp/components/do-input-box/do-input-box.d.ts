import { Events, ViewController } from 'ionic-angular';
import { DoChatService } from '../../providers/chat-service';
import { Conversation } from 'leancloud-realtime';
export declare class DoInputBox {
    events: Events;
    chatService: DoChatService;
    viewCtrl: ViewController;
    text: string;
    image: string;
    audio: string;
    video: string;
    conv: Conversation;
    constructor(events: Events, chatService: DoChatService, viewCtrl: ViewController);
    send(): void;
    onKeyup(event: any): void;
    onKeypress(event: any): void;
    onChange(event: any): void;
    onFocuse(event: any): void;
    onBlur(event: any): void;
    willLeave(): void;
}
