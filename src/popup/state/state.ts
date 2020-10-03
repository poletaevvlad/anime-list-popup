import SeriesInfo from "../../listdata/seriesinfo";
import UserInfo from "../../listdata/userinfo";
import { AnimeStatus } from "../../listdata/api";

export interface AnimeListEntry {
    series: SeriesInfo;
    episodesWatched: number;
    assignedScore: number;
}

export interface AnimeList {
    entries: AnimeListEntry[];
    status: "loading" | "all_loaded" | "has_more_items"
}

export interface ApplicationState {
    isLoggedIn: boolean;
    userInfo: UserInfo;
    currentList: AnimeStatus;
    animeLists: { [key in AnimeStatus]: AnimeList };
}