import { AnimeStatus } from "../../listdata/api";
import UserInfo from "../../listdata/userinfo";

export interface Action { }

export class CurrentListChanged implements Action {
    readonly newStatus: AnimeStatus;

    constructor(newStatus: AnimeStatus) {
        this.newStatus = newStatus;
    }
}

export class UserInfoLoaded implements Action {
    readonly userInfo: UserInfo;

    constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }
}
