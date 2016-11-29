import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DoMessage } from '../../providers/chat-service';

@Component({
  selector: 'message-item',
  templateUrl: 'message-item.html'
})
export class DoMssageItem {
  @Input()
  message: DoMessage
  constructor() {
  }
}
