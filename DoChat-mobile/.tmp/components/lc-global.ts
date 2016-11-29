import { IMClient } from 'leancloud-realtime';
export var lcGlobal = {
    leancloud: {
        appId: '3knLr8wGGKUBiXpVAwDnryNT-gzGzoHsz',
        // appKey: 'mrChsHGwIAytLHopODLpqiHo',
        region: 'cn',
        publicConId: '57fc97f55bbb50005b3a25a9'
    },
    realtime_config: {
        localCache: false
    },
    version:'0.0.1'
};


// export var currentClient: IMClient;
// export function initClient(client: IMClient) {
//     currentClient = client;
// }

export class SharedService {
    public static client: IMClient;
    public static clientId: string;
    public static currentConv?: string;
    public static unreadBadge: number = 0;
    public static noticeText?: string = '消息';
    public static getNoticText() {
        if (SharedService.unreadBadge > 0) {
            SharedService.noticeText = '消息(' + SharedService.unreadBadge + ')';
        } else {
            SharedService.noticeText = '消息';
        }
        return SharedService.noticeText;
    }
}
