import UserInfo from "../../listdata/userinfo";
import { AnimeStatus, AnimeListEntry } from "../../listdata/api";

export interface AnimeList {
    entries: AnimeListEntry[];
    status: "loading" | "all_loaded" | "has_more_items"
}

export interface ApplicationState {
    userInfo: UserInfo;
    currentList: AnimeStatus;
    animeLists: { [key in AnimeStatus]: AnimeList };
    updatingAnime: Set<number>
}

export const EMPTY_LISTS: { [key in AnimeStatus]: AnimeList } = {
    "watching": { entries: [], status: "has_more_items" },
    "completed": { entries: [], status: "has_more_items" },
    "on-hold": { entries: [], status: "has_more_items" },
    "dropped": { entries: [], status: "has_more_items" },
    "plan-to-watch": { entries: [], status: "has_more_items" },
};

export const INITIAL_STATE: ApplicationState = {
    userInfo: null,
    currentList: "watching",
    animeLists: EMPTY_LISTS,
    updatingAnime: new Set<number>()
}
