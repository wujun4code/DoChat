import { Component } from '@angular/core';

/*
  Generated class for the LCChat component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'lc-chat',
  templateUrl: 'lc-chat.html'
})
export class LCChat {

  text: string;

  constructor() {
    console.log('Hello LCChat Component');
    this.text = 'Hello World';
  }

}
