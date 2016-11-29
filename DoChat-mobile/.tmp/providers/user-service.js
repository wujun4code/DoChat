import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable, Subject } from 'rxjs';
import { Friend } from './data-service';
export var DoFriend = (function () {
    function DoFriend(friend) {
        this.metaFriend = friend;
    }
    DoFriend.prototype.getAvatar = function () {
        return this.metaFriend.avatar || null;
    };
    DoFriend.prototype.hasAvatar = function () {
        return this.metaFriend.avatar && 0 !== this.metaFriend.avatar.length;
    };
    DoFriend.prototype.getNameText = function () {
        var rtn = this.metaFriend.clientId;
        if (this.metaFriend.nickName && this.metaFriend.nickName.length > 0) {
            rtn = this.metaFriend.nickName;
        }
        if (this.metaFriend.markName && this.metaFriend.markName.length > 0) {
            rtn = this.metaFriend.markName;
        }
        return rtn;
    };
    return DoFriend;
}());
export var DoUserService = (function () {
    function DoUserService(http) {
        this.http = http;
    }
    //doFrinendStream: Subject<DoFriend> = new Subject<DoFriend>();
    DoUserService.prototype.getDoFriendByIds = function (ids) {
        var _this = this;
        console.log('ids', ids);
        var doFrinendStream = new Subject();
        ids.forEach(function (id) {
            _this.getFriend(id).forEach(function (f) {
                var dofri = new DoFriend(f);
                doFrinendStream.next(dofri);
            });
        });
        return doFrinendStream.asObservable();
    };
    DoUserService.prototype.getFriends = function () {
        var _this = this;
        if (this.friends)
            Observable.fromPromise(new Promise(function (resolve) {
                resolve(_this.friends);
            }));
        return this.http.get('assets/json/friends.json').map(function (res) {
            _this.friends = res.json();
            return _this.friends;
        });
    };
    DoUserService.prototype.getFriend = function (clientId) {
        return this.getFriends().map(function (friends) {
            var f = friends.find(function (friend, i, a) {
                return friend.clientId == clientId;
            });
            if (f == null) {
                f = new Friend();
                f.clientId = clientId;
            }
            //console.log('getFriend', JSON.stringify(f));
            return f;
        });
    };
    DoUserService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DoUserService.ctorParameters = [
        { type: Http, },
    ];
    return DoUserService;
}());
