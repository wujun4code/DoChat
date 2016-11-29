import { NavController, NavParams, Events } from 'ionic-angular';
export declare class ContactDetailPage {
    navCtrl: NavController;
    navParams: NavParams;
    events: Events;
    friendId: string;
    constructor(navCtrl: NavController, navParams: NavParams, events: Events);
    ionViewDidLoad(): void;
    navToChatPage(event: any): void;
}
