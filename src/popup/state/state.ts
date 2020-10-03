import SeriesInfo from "../../listdata/seriesinfo";
import UserInfo from "../../listdata/userinfo";
import { AnimeStatus } from "../../listdata/api";

export interface AnimeListEntry {
    series: SeriesInfo;
    episodesWatched: number;
    assignedScore: boolean;
}

export interface AnimeList {
    entries: AnimeListEntry[];
    isLoading: boolean;
}

export interface ApplicationState {
    isLoggedIn: boolean;
    userInfo: UserInfo;
    currentList: AnimeStatus;
    animeLists: { [key in AnimeStatus]: AnimeList };
}