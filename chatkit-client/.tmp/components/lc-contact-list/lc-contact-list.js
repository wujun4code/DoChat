import { Component } from '@angular/core';
/*
  Generated class for the LCContactList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
export var LCContactList = (function () {
    function LCContactList() {
        console.log('Hello LCContactList Component');
        this.text = 'Hello World';
    }
    LCContactList.prototype.popupSearchFriend = function (event) {
    };
    LCContactList.decorators = [
        { type: Component, args: [{
                    selector: 'lc-contact-list',
                    templateUrl: 'lc-contact-list.html'
                },] },
    ];
    /** @nocollapse */
    LCContactList.ctorParameters = [];
    return LCContactList;
}());
