import { AnimeList, AnimeListType } from "../../model";
import Action from "./actions";
import { AnimeListState, ApplicationState, EMPTY_LISTS } from "./state";

export type Reducer<T> = (currentState: T, action: Action) => T;

const animeListReducer: Reducer<Record<AnimeListType, AnimeListState>> = (
  current,
  action
) => {
  switch (action.type) {
    case "clear-data":
      return EMPTY_LISTS;
    case "anime-loading-finished":
      return {
        ...current,
        [action.listType]: {
          entries: current[action.listType].entries.extend(action.list),
          isLoading: false,
        },
      };
    case "loading-anime-list":
      return {
        ...current,
        [action.listType]: {
          ...current[action.listType],
          isLoading: true,
        },
      };
    case "series-updating": {
      const newLists = {
        ...current,
        [AnimeListType.SearchResults]: {
          ...current[AnimeListType.SearchResults],
          entries: current[AnimeListType.SearchResults].entries.updateEntry(
            action.seriesId,
            action.update
          ),
        },
      };
      if (action.status) {
        newLists[action.status] = {
          ...current[action.status],
          entries: current[action.status].entries.updateEntry(
            action.seriesId,
            action.update
          ),
        };
      }
      return newLists;
    }
    case "series-update-done":
      if (!action.originalStatus) {
        return {
          ...current,
          [action.seriesStatus.status]: {
            entries: AnimeList.INITIAL,
            isLoading: false,
          },
        };
      }
      if (action.originalStatus != action.seriesStatus.status) {
        return {
          ...current,
          [action.seriesStatus.status]: {
            entries: AnimeList.INITIAL,
            isLoading: false,
          },
          [action.originalStatus]: {
            ...current[action.originalStatus],
            entries: current[action.originalStatus].entries.remove(
              action.seriesId
            ),
          },
        };
      }
      return {
        ...current,
        [action.seriesStatus.status]: {
          ...current[action.seriesStatus.status],
          entries: current[action.seriesStatus.status].entries.updateEntry(
            action.seriesId,
            action.seriesStatus
          ),
        },
      };
    case "start-search": {
      return {
        ...current,
        [AnimeListType.SearchResults]: {
          isLoading: false,
          entries: AnimeList.INITIAL,
        },
      };
    }
    default:
      return { ...current };
  }
};

const loadingCounterReducer: Reducer<number> = (current, action) => {
  switch (action.type) {
    case "loading-anime-list":
    case "series-updating":
      return current + 1;

    case "anime-loading-finished":
    case "series-update-done":
      return current - 1;

    default:
      return current;
  }
};

export const rootReducer: Reducer<ApplicationState> = (current, action) => {
  current = {
    ...current,
    loadingCounter: loadingCounterReducer(current.loadingCounter, action),
  };
  switch (action.type) {
    case "current-list-changed":
      return {
        ...current,
        currentList: action.listType,
        previousList: current.currentList,
      };
    case "user-info-loaded":
      return {
        ...current,
        user: action.user,
      };
    case "series-updating":
      return {
        ...current,
        statusSuggestion: null,
        updatingAnime: new Set([...current.updatingAnime, action.seriesId]),
        animeLists: animeListReducer(current.animeLists, action),
      };
    case "series-update-done": {
      const updating = new Set(current.updatingAnime);
      updating.delete(action.seriesId);
      return {
        ...current,
        updatingAnime: updating,
        animeLists: animeListReducer(current.animeLists, action),
      };
    }
    case "set-error":
      return {
        ...current,
        errorMessage: {
          title: action.title,
          message: action.message,
          retryAction: action.retry,
        },
      };
    case "clear-error":
      return { ...current, errorMessage: null };
    case "set-suggestion":
      return {
        ...current,
        statusSuggestion: {
          listEntry: action.listEntry,
          acceptUpdate: action.acceptUpdate,
          rejectUpdate: action.rejectUpdate,
        },
      };
    case "set-theme":
      return { ...current, theme: action.theme };
    case "start-search": {
      const state = {
        ...current,
        query: action.query,
        animeLists: animeListReducer(current.animeLists, action),
      };
      if (current.currentList != AnimeListType.SearchResults) {
        state.currentList = AnimeListType.SearchResults;
        state.previousList = current.currentList;
      }
      return state;
    }
    case "finish-search":
      return {
        ...current,
        currentList: current.previousList,
      };
    default:
      return {
        ...current,
        animeLists: animeListReducer(current.animeLists, action),
      };
  }
};
