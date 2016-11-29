import { Component, Input } from '@angular/core';
export var DoMssageItem = (function () {
    function DoMssageItem() {
    }
    DoMssageItem.decorators = [
        { type: Component, args: [{
                    selector: 'message-item',
                    templateUrl: 'message-item.html'
                },] },
    ];
    /** @nocollapse */
    DoMssageItem.ctorParameters = [];
    DoMssageItem.propDecorators = {
        'message': [{ type: Input },],
    };
    return DoMssageItem;
}());
