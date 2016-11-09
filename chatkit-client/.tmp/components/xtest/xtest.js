import { Component } from '@angular/core';
/*
  Generated class for the Xtest component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
export var Xtest = (function () {
    function Xtest() {
        console.log('Hello Xtest Component');
        this.text = 'Hello World';
    }
    Xtest.decorators = [
        { type: Component, args: [{
                    selector: 'xtest',
                    templateUrl: 'xtest.html'
                },] },
    ];
    /** @nocollapse */
    Xtest.ctorParameters = [];
    return Xtest;
}());
