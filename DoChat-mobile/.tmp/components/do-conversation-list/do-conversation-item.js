import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Events } from 'ionic-angular';
/*
  Generated class for the LCContactListItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
export var DoConversationItem = (function () {
    function DoConversationItem(events) {
        this.events = events;
        this.convItemClicked = new EventEmitter();
        // this.events.subscribe('messageBadge', (data) => {
        //   console.log('messageBadge', this.conv.unreadBadge);
        // });
    }
    Object.defineProperty(DoConversationItem.prototype, "convItem", {
        // @Input()
        // badge: number;
        set: function (convItem) {
            this.conv = convItem;
            var imgChecker = this.conv.titleImg || '';
            this.hasImage = imgChecker.length > 0;
            if (this.conv.lastMessage) {
                this.hasLastMessage = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    DoConversationItem.prototype.onConversationItemClick = function (item) {
        this.convItemClicked.emit({ id: this.conv.id, name: this.conv.name });
    };
    DoConversationItem.prototype.ngOnInit = function () {
    };
    DoConversationItem.decorators = [
        { type: Component, args: [{
                    selector: 'do-conversation-item',
                    templateUrl: 'do-conversation-item.html'
                },] },
    ];
    /** @nocollapse */
    DoConversationItem.ctorParameters = [
        { type: Events, },
    ];
    DoConversationItem.propDecorators = {
        'convItem': [{ type: Input },],
        'convItemClicked': [{ type: Output },],
    };
    return DoConversationItem;
}());
export var DoConversation = (function () {
    function DoConversation() {
    }
    return DoConversation;
}());
