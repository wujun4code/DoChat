import { Events } from 'ionic-angular';
export declare class LCInputBox {
    events: Events;
    conversationId: string;
    text: string;
    convId: string;
    constructor(events: Events);
    send(): void;
}
