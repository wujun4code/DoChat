import { NavController } from 'ionic-angular';
export declare class HomePage {
    navCtrl: NavController;
    clientId: string;
    constructor(navCtrl: NavController);
    ionViewDidLoad(): void;
    navToChat(con: any): void;
}
