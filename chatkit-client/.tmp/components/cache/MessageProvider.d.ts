import { IMessage } from './IMessage';
export declare class MessageProvider {
    messageProvider: IMessage;
    getProvider(clientId: string): IMessage;
}
