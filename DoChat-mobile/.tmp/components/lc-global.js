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
    version: '0.0.1'
};
// export var currentClient: IMClient;
// export function initClient(client: IMClient) {
//     currentClient = client;
// }
export var SharedService = (function () {
    function SharedService() {
    }
    SharedService.getNoticText = function () {
        if (SharedService.unreadBadge > 0) {
            SharedService.noticeText = '消息(' + SharedService.unreadBadge + ')';
        }
        else {
            SharedService.noticeText = '消息';
        }
        return SharedService.noticeText;
    };
    SharedService.unreadBadge = 0;
    SharedService.noticeText = '消息';
    return SharedService;
}());
