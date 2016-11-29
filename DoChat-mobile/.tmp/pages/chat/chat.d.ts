import { NavController, NavParams, ViewController } from 'ionic-angular';
export declare class ChatPage {
    navCtrl: NavController;
    params: NavParams;
    viewCtrl: ViewController;
    convName: string;
    convId: string;
    friendId: string;
    friendIds: string[];
    constructor(navCtrl: NavController, params: NavParams, viewCtrl: ViewController);
    ionViewDidLoad(): void;
    onMessage(message: any): void;
}
