import { Component, Output, EventEmitter } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
import { SharedService } from '../lc-global';
export var DoContactList = (function () {
    function DoContactList(dataService) {
        var _this = this;
        this.dataService = dataService;
        this.onFriendClicked = new EventEmitter();
        this.staredFriends = [];
        this.friends = [];
        this.dataService.getFriends(SharedService.clientId, true).then(function (friends) {
            friends.forEach(function (v, i, a) {
                if (v.isStard) {
                    _this.staredFriends.push({
                        name: v.markName.length > 0 ? v.markName : v.nickName,
                        clientId: v.clientId,
                        avatar: v.avatar
                    });
                }
                else {
                    _this.friends.push({
                        name: v.markName.length > 0 ? v.markName : v.nickName,
                        clientId: v.clientId,
                        avatar: v.avatar
                    });
                }
            });
        });
    }
    DoContactList.prototype.ngOnInit = function () {
    };
    DoContactList.prototype.onContactItemClick = function (friend) {
        this.onFriendClicked.emit({
            name: friend.name,
            clientId: friend.clientId,
            avatar: friend.avatar
        });
    };
    DoContactList.prototype.popupSearchFriend = function (event) {
    };
    DoContactList.prototype.popupGroupChat = function (event) {
    };
    DoContactList.prototype.popupEditTag = function (event) {
    };
    DoContactList.prototype.popupOfficialAccounts = function (event) {
    };
    DoContactList.decorators = [
        { type: Component, args: [{
                    selector: 'do-contact-list',
                    templateUrl: 'do-contact-list.html'
                },] },
    ];
    /** @nocollapse */
    DoContactList.ctorParameters = [
        { type: DoDataService, },
    ];
    DoContactList.propDecorators = {
        'onFriendClicked': [{ type: Output },],
    };
    return DoContactList;
}());
