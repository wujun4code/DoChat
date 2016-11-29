import { Pipe } from '@angular/core';
export var StrEqualsPipe = (function () {
    function StrEqualsPipe() {
    }
    StrEqualsPipe.prototype.transform = function (value, campare) {
        console.log('StrEqualsPipe');
        console.log('value', value);
        console.log('campare', campare);
        console.log('p1', value == campare);
        console.log('p2', value === campare);
        return value === campare;
    };
    StrEqualsPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'strEquals'
                },] },
    ];
    /** @nocollapse */
    StrEqualsPipe.ctorParameters = [];
    return StrEqualsPipe;
}());
