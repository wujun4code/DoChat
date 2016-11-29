import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the GlobalService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export var GlobalService = (function () {
    function GlobalService(http) {
        this.http = http;
        console.log('Hello GlobalService Provider');
    }
    GlobalService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    GlobalService.ctorParameters = [
        { type: Http, },
    ];
    return GlobalService;
}());
