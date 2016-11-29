import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Friend } from './data-service';
export declare class DoFriend {
    metaFriend: Friend;
    constructor(friend: Friend);
    getAvatar(): string;
    hasAvatar(): boolean;
    getNameText(): string;
}
export declare class DoUserService {
    http: Http;
    friends: Friend[];
    constructor(http: Http);
    getDoFriendByIds(ids: string[]): Observable<DoFriend>;
    getFriends(): Observable<Friend[]>;
    getFriend(clientId: string): Observable<Friend>;
}
