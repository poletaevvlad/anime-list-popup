import { AnimeStatus } from "./api"
import * as browser from "webextension-polyfill";

const statusUrlParams: { [key in AnimeStatus]: number } = {
    "watching": 1,
    "completed": 2,
    "on-hold": 3,
    "dropped": 4,
    "plan-to-watch": 6,
}

interface UserInfoCache {
    username: string
    profileImageUrl?: string
}

export default class UserInfo {
    readonly username: string;
    readonly profileImageUrl?: string;

    constructor(username: string, profileImageUrl?: string) {
        this.username = username
        this.profileImageUrl = profileImageUrl
    }

    get profileUrl(): string {
        return `https://myanimelist.net/profile/${this.username}`
    };

    animeListUrl(list?: AnimeStatus): string {
        let url = `https://myanimelist.net/animelist/${this.username}`
        if (typeof list != "undefined") {
            url += "?status=" + statusUrlParams[list]
        }
        return url
    }

    get mangaListUrl(): string {
        return `https://myanimelist.net/mangalist/${this.username}`
    }

    static loadCached(): Promise<UserInfo | null> {
        return browser.storage.local.get("user_info").then(
            (results) => {
                if (typeof (results["user_info"]) == "undefined") {
                    return null;
                }
                const cache = results["user_info"] as UserInfoCache
                return new UserInfo(cache.username, cache.profileImageUrl);
            },
            () => null,
        );
    }

    saveIntoCache(): Promise<void> {
        const cache: UserInfoCache = {
            username: this.username,
            profileImageUrl: this.profileImageUrl,
        };
        return browser.storage.local.set({ user_info: cache });
    }

    static removeFromCache(): Promise<void> {
        return browser.storage.local.remove("user_info")
    }

}
