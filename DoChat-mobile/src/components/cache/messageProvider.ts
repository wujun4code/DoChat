import { MessageSQLite } from './MessageSQLite';
import { IMessage } from './IMessage';
export class MessageProvider {
    messageProvider: IMessage;
    getProvider(clientId: string) {
        if (this.messageProvider == null)
            this.messageProvider = new MessageSQLite(clientId);
        return this.messageProvider;
    }
}
