import { Component } from '@angular/core';
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
