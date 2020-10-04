import { AnimeStatus } from "../../listdata/api";
import Action from "./actions";
import { ApplicationState, AnimeList } from "./state";

export type Reducer<T> = (currentState: T, action: Action) => T;

const animeListReducer: Reducer<{ [key in AnimeStatus]: AnimeList }> = (current, action) => {
    switch (action.type) {
        case "anime-loading-finished":
            return {
                ...current,
                [action.status]: {
                    entries: [...current[action.status].entries, ...action.entries],
                    status: action.hasMoreEntries ? "has_more_items" : "all_loaded"
                }
            };
        case "loading-anime-list":
            return {
                ...current,
                [action.status]: {
                    ...current[action.status],
                    status: "loading",
                }
            }
        default:
            return { ...current };
    }
}

export const rootReducer: Reducer<ApplicationState> = (current, action) => {
    switch (action.type) {
        case "current-list-changed":
            const list = current.animeLists[action.status];
            return {
                ...current,
                currentList: action.status
            };
        case "user-info-loaded":
            return {
                ...current,
                userInfo: action.userInfo
            };
        default:
            return {
                ...current,
                animeLists: animeListReducer(current.animeLists, action)
            };
    }
}