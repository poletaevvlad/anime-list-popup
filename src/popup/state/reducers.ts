import { AnimeStatus, AnimeListEntry } from "../../listdata/api";
import Action from "./actions";
import { ApplicationState, AnimeList, EMPTY_LISTS } from "./state";

export type Reducer<T> = (currentState: T, action: Action) => T;

const animeListReducer: Reducer<{ [key in AnimeStatus]: AnimeList }> = (current, action) => {
    switch (action.type) {
        case "clear-data":
            return EMPTY_LISTS;
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
        case "series-updating":
            return {
                ...current,
                [action.status]: {
                    ...current[action.status],
                    entries: current[action.status].entries.map(entry => {
                        if (entry.series.id != action.seriesId) {
                            return entry;
                        }
                        const newEntry: AnimeListEntry = {
                            series: entry.series,
                            episodesWatched: typeof (action.update.episodesWatched) == "undefined"
                                ? entry.episodesWatched : action.update.episodesWatched,
                            assignedScore: typeof (action.update.assignedScore) == "undefined"
                                ? entry.assignedScore : action.update.assignedScore,
                            status: typeof (action.update.status) == "undefined"
                                ? entry.status : action.update.status
                        };
                        return newEntry;
                    })
                }
            }
        case "series-update-done":
            if (action.originalStatus != action.status) {
                return {
                    ...current,
                    [action.status]: {
                        entries: [],
                        status: "has_more_items"
                    },
                    [action.originalStatus]: {
                        ...current[action.originalStatus],
                        entries: current[action.originalStatus].entries
                            .filter(entry => entry.series.id != action.seriesId)
                    }
                }
            }
            return {
                ...current,
                [action.status]: {
                    ...current[action.status],
                    entries: current[action.status].entries.map(entry => {
                        if (entry.series.id != action.seriesId) {
                            return entry;
                        }
                        return {
                            series: entry.series,
                            episodesWatched: action.episodesWatched,
                            assignedScore: action.score,
                        };
                    })

                }
            }
        default:
            return { ...current };
    }
}

const loadingCounterReducer: Reducer<number> = (current, action) => {
    switch (action.type) {
        case "loading-anime-list":
        case "series-updating":
            return current + 1;

        case "anime-loading-finished":
        case "series-update-done":
            return current - 1;

        default:
            return current
    }
}

export const rootReducer: Reducer<ApplicationState> = (current, action) => {
    current = {
        ...current,
        loadingCounter: loadingCounterReducer(current.loadingCounter, action)
    };
    switch (action.type) {
        case "current-list-changed":
            const list = current.animeLists[action.status];
            return {
                ...current,
                currentList: action.status,
            };
        case "user-info-loaded":
            return {
                ...current,
                userInfo: action.userInfo
            };
        case "series-updating":
            return {
                ...current,
                updatingAnime: new Set([...current.updatingAnime, action.seriesId]),
                animeLists: animeListReducer(current.animeLists, action),
            }
        case "series-update-done":
            const updating = new Set(current.updatingAnime);
            updating.delete(action.seriesId)
            return {
                ...current,
                updatingAnime: updating,
                animeLists: animeListReducer(current.animeLists, action),
            }
        default:
            return {
                ...current,
                animeLists: animeListReducer(current.animeLists, action)
            };
    }
}