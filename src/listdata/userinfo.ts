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

    get animeListUrl(): string {
        return `https://myanimelist.net/animelist/${this.username}`
    }

    get mangaListUrl(): string {
        return `https://myanimelist.net/mangalist/${this.username}`
    }
}
