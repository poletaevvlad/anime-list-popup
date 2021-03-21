import UserInfo from "../../listdata/userinfo";
import { AnimeStatus, AnimeListEntry, SeriesUpdate } from "../../listdata/api";
import AsyncDispatcher from "./asyncDispatcher"
import SeriesInfo from "../../listdata/seriesinfo";
import { ThemeData } from "../../listdata/theme";

export interface AnimeList {
    entries: AnimeListEntry[];
    status: "loading" | "all_loaded" | "has_more_items"
}

export interface ErrorMessage {
    title: string;
    message: string;
    retryAction: (dispatcher: AsyncDispatcher) => void
}

export interface StatusChangeSuggestion {
    series: SeriesInfo
    acceptUpdate: SeriesUpdate
    rejectUpdate: SeriesUpdate
    currentStatus: AnimeStatus
    newStatus: AnimeStatus
}

export interface ApplicationState {
    userInfo: UserInfo;
    currentList: AnimeStatus;
    animeLists: { [key in AnimeStatus]: AnimeList };
    updatingAnime: Set<number>;
    loadingCounter: number;
    errorMessage: ErrorMessage | null;
    statusSuggestion: StatusChangeSuggestion | null;
    theme: ThemeData;
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
    updatingAnime: new Set<number>(),
    loadingCounter: 0,
    errorMessage: null,
    statusSuggestion: null,
    theme: ThemeData.DEFAULT_THEME,
}
