import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
    selector: 'do-contact-item',
    templateUrl: 'do-contact-item.html'
})
export class DoContactItem {
    name: string;
    clientId: string;
    avatar: string;
    constructor() {
    }
    @Input()
    set friendId(clientId: string) {
        this.clientId = clientId;
    }
    @Input()
    set friendName(name: string) {
        this.name = name;
    }
    @Input()
    set avatarUrl(url: string) {
        this.avatar = url;
    }
    @Output() contactClicked = new EventEmitter<{
        name?: string,
        clientId?: string,
        avatar?: string
    }>();

    onContactItemClick(event) {
        this.contactClicked.emit({
            name: this.name,
            clientId: this.clientId,
            avatar: this.avatar
        });
    }
}
