import { Pipe } from '@angular/core';
import * as moment from 'moment';
export var FromNowPipe = (function () {
    function FromNowPipe() {
    }
    FromNowPipe.prototype.transform = function (value) {
        return moment(value).locale('zh-cn').fromNow();
    };
    FromNowPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'fromNow'
                },] },
    ];
    /** @nocollapse */
    FromNowPipe.ctorParameters = [];
    return FromNowPipe;
}());
