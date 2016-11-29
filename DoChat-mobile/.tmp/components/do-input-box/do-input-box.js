import { Component, Input } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import { DoChatService } from '../../providers/chat-service';
import { TextMessage } from 'leancloud-realtime';
export var DoInputBox = (function () {
    function DoInputBox(events, chatService, viewCtrl) {
        this.events = events;
        this.chatService = chatService;
        this.viewCtrl = viewCtrl;
        this.viewCtrl.willLeave.subscribe(this.willLeave);
    }
    DoInputBox.prototype.send = function () {
        var textMessage = new TextMessage(this.text);
        this.chatService.sendMessage(this.conv, textMessage);
        // this.events.publish('lc:send', {
        //   id: this.conversationId,
        //   text: this.text
        // });
        this.text = '';
    };
    DoInputBox.prototype.onKeyup = function (event) {
        console.log('onKeyup', event.keyCode, event.target.value);
    };
    DoInputBox.prototype.onKeypress = function (event) {
        if (event.keyCode == 13) {
            this.send();
            this.chatService.sendOperationMessage(this.conv, 'pause');
        }
        //console.log('onKeypress', event.keyCode, event.target.value);
    };
    DoInputBox.prototype.onChange = function (event) {
        if (event.target.value.length == 1) {
            this.chatService.sendOperationMessage(this.conv, 'typing');
        }
        if (event.target.value.length % 5 == 0) {
            this.chatService.sendOperationMessage(this.conv, 'typing');
        }
        //console.log('onChange', event.keyCode, event.target.value);
    };
    DoInputBox.prototype.onFocuse = function (event) {
        this.chatService.sendOperationMessage(this.conv, 'typing');
        //console.log('onFocuse', event.keyCode, event.target.value);
    };
    DoInputBox.prototype.onBlur = function (event) {
        this.chatService.sendOperationMessage(this.conv, 'pause');
        //console.log('onBlur', event.keyCode, event.target.value);
    };
    DoInputBox.prototype.willLeave = function () {
        //this.chatService.sendOperationMessage(this.conv, 'pause');
    };
    DoInputBox.decorators = [
        { type: Component, args: [{
                    selector: 'do-input-box',
                    templateUrl: 'do-input-box.html'
                },] },
    ];
    /** @nocollapse */
    DoInputBox.ctorParameters = [
        { type: Events, },
        { type: DoChatService, },
        { type: ViewController, },
    ];
    DoInputBox.propDecorators = {
        'conv': [{ type: Input },],
    };
    return DoInputBox;
}());
