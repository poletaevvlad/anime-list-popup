import { AnimeStatus } from ".";
import * as browser from "webextension-polyfill";
import * as schema from "./api_schema";

const statusUrlParams: Record<AnimeStatus, number> = {
  [AnimeStatus.Watching]: 1,
  [AnimeStatus.Completed]: 2,
  [AnimeStatus.OnHold]: 3,
  [AnimeStatus.Dropped]: 4,
  [AnimeStatus.PlanToWatch]: 6,
};

interface UserInfoCache {
  username: string;
  profileImageUrl?: string;
}

export default class User {
  constructor(readonly username: string, readonly profileImageUrl?: string) {}

  static fromResponse(response: schema.User): User {
    return new User(response.name, response.picture);
  }

  get profileUrl(): string {
    return `https://myanimelist.net/profile/${this.username}`;
  }

  animeListUrl(list?: AnimeStatus): string {
    let url = `https://myanimelist.net/animelist/${this.username}`;
    if (typeof list != "undefined") {
      url += "?status=" + statusUrlParams[list];
    }
    return url;
  }

  get mangaListUrl(): string {
    return `https://myanimelist.net/mangalist/${this.username}`;
  }

  static loadCached(): Promise<User | null> {
    return browser.storage.local.get("user_info").then(
      (results) => {
        if (typeof results["user_info"] == "undefined") {
          return null;
        }
        const cache = results["user_info"] as UserInfoCache;
        return new User(cache.username, cache.profileImageUrl);
      },
      () => null
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
    return browser.storage.local.remove("user_info");
  }
}
