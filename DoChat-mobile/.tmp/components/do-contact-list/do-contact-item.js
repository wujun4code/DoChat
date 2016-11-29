import { Component, Input, Output, EventEmitter } from '@angular/core';
export var DoContactItem = (function () {
    function DoContactItem() {
        this.contactClicked = new EventEmitter();
    }
    Object.defineProperty(DoContactItem.prototype, "friendId", {
        set: function (clientId) {
            this.clientId = clientId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoContactItem.prototype, "friendName", {
        set: function (name) {
            this.name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoContactItem.prototype, "avatarUrl", {
        set: function (url) {
            this.avatar = url;
        },
        enumerable: true,
        configurable: true
    });
    DoContactItem.prototype.onContactItemClick = function (event) {
        this.contactClicked.emit({
            name: this.name,
            clientId: this.clientId,
            avatar: this.avatar
        });
    };
    DoContactItem.decorators = [
        { type: Component, args: [{
                    selector: 'do-contact-item',
                    templateUrl: 'do-contact-item.html'
                },] },
    ];
    /** @nocollapse */
    DoContactItem.ctorParameters = [];
    DoContactItem.propDecorators = {
        'friendId': [{ type: Input },],
        'friendName': [{ type: Input },],
        'avatarUrl': [{ type: Input },],
        'contactClicked': [{ type: Output },],
    };
    return DoContactItem;
}());
