import { Component } from '@angular/core';

/*
  Generated class for the LCContactList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'lc-contact-list',
  templateUrl: 'lc-contact-list.html'
})
export class LCContactList {

  text: string;

  constructor() {
    console.log('Hello LCContactList Component');
    this.text = 'Hello World';
  }
  popupSearchFriend(event) {
  }
}
