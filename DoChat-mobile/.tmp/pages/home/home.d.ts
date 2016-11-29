import { NavController, Events } from 'ionic-angular';
export declare class HomePage {
    navCtrl: NavController;
    events: Events;
    clientId: string;
    title: string;
    constructor(navCtrl: NavController, events: Events);
    ionViewDidLoad(): void;
    navToChat(con: any): void;
    ionViewWillEnter(): void;
}
