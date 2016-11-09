import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
export var LCInputBox = (function () {
    function LCInputBox(events) {
        this.events = events;
    }
    Object.defineProperty(LCInputBox.prototype, "convId", {
        set: function (convId) {
            this.conversationId = convId;
        },
        enumerable: true,
        configurable: true
    });
    LCInputBox.prototype.send = function () {
        this.events.publish('lc:send', {
            id: this.conversationId,
            text: this.text
        });
        this.text = '';
    };
    LCInputBox.decorators = [
        { type: Component, args: [{
                    selector: 'lc-input-box',
                    templateUrl: 'lc-input-box.html'
                },] },
    ];
    /** @nocollapse */
    LCInputBox.ctorParameters = [
        { type: Events, },
    ];
    LCInputBox.propDecorators = {
        'convId': [{ type: Input },],
    };
    return LCInputBox;
}());
