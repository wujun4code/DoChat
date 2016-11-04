import { Realtime, IMClient, Message, Conversation, TextMessage } from 'leancloud-realtime';
export var lcGlobal = {
    leancloud: {
        appId: '3knLr8wGGKUBiXpVAwDnryNT-gzGzoHsz',
        appKey: '3RpBhjoPXJjVWvPnVmPyFExt',
        region: 'cn',
        publicConId: '57fc97f55bbb50005b3a25a9'
    },
    realtime_config: {
        localCache: false
    }
};

// export var currentClient: IMClient;
// export function initClient(client: IMClient) {
//     currentClient = client;
// }

export class SharedService {
    public static client: IMClient;
}
