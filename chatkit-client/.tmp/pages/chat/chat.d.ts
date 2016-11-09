import { NavController, NavParams, Content } from 'ionic-angular';
export declare class ChatPage {
    navCtrl: NavController;
    params: NavParams;
    convName: string;
    convId: string;
    chatContent: Content;
    constructor(navCtrl: NavController, params: NavParams);
    ionViewDidLoad(): void;
    onMessage(message: any): void;
}
