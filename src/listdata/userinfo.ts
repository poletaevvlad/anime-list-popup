import { AnimeStatus } from "./api"

const statusUrlParams: { [key in AnimeStatus]: number } = {
    "watching": 1,
    "completed": 2,
    "on-hold": 3,
    "dropped": 4,
    "plan-to-watch": 6,
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
}
