import { Component } from '@angular/core';

/*
  Generated class for the Xtest component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'xtest',
  templateUrl: 'xtest.html'
})
export class Xtest {

  text: string;

  constructor() {
    console.log('Hello Xtest Component');
    this.text = 'Hello World';
  }

}
