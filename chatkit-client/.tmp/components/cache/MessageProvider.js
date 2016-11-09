import { MessageSQLite } from './MessageSQLite';
export var MessageProvider = (function () {
    function MessageProvider() {
    }
    MessageProvider.prototype.getProvider = function (clientId) {
        if (this.messageProvider == null)
            this.messageProvider = new MessageSQLite(clientId);
        return this.messageProvider;
    };
    return MessageProvider;
}());
