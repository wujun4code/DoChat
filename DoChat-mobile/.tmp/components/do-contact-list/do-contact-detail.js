import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DoDataService } from '../../providers/data-service';
import { SharedService } from '../lc-global';
export var DoContactDetail = (function () {
    function DoContactDetail(dataService) {
        this.dataService = dataService;
        this.avatar = '';
        this.markName = '';
        this.nickName = '';
        this.isStared = false;
        this.location = '';
        this.clickNavToChat = new EventEmitter();
    }
    DoContactDetail.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getFriendById(SharedService.clientId, this.clientId).then(function (friend) {
            _this.avatar = friend.avatar;
            _this.clientId = friend.clientId;
            _this.nickName = friend.nickName;
            _this.markName = friend.markName;
            _this.isStared = friend.isStard;
            _this.location = friend.location;
        });
    };
    DoContactDetail.prototype.navToSetTags = function (event) {
    };
    DoContactDetail.prototype.navToChat = function (event) {
        this.clickNavToChat.emit({
            clientId: this.clientId,
            markName: this.markName.length > 0 ? this.markName : this.nickName,
        });
    };
    DoContactDetail.decorators = [
        { type: Component, args: [{
                    selector: 'do-contact-detail',
                    templateUrl: 'do-contact-detail.html'
                },] },
    ];
    /** @nocollapse */
    DoContactDetail.ctorParameters = [
        { type: DoDataService, },
    ];
    DoContactDetail.propDecorators = {
        'clientId': [{ type: Input, args: ['clientId',] },],
        'clickNavToChat': [{ type: Output },],
    };
    return DoContactDetail;
}());
