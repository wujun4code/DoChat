import { NavController } from 'ionic-angular';
import { DoDataService } from '../../providers/data-service';
export declare class LoginPage {
    navCtrl: NavController;
    dataService: DoDataService;
    clientId: string;
    constructor(navCtrl: NavController, dataService: DoDataService);
    goHome(event: any): void;
    onKeypress(event: any): void;
    ionViewDidLoad(): void;
}
