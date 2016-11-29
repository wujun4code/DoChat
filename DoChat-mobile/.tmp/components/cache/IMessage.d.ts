import { Message, Conversation } from 'leancloud-realtime';
export interface IMessage {
    push(message: Message, conversation: Conversation): Promise<string>;
    query(convId: string): Promise<Array<{
        text?: string;
        imageUrl?: string;
        date?: Date;
        from?: string;
    }>>;
}
