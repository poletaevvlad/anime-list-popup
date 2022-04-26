import { AnimeStatus } from "../../model";
import Action from "./actions";
import { AnimeListState, ApplicationState, EMPTY_LISTS } from "./state";

export type Reducer<T> = (currentState: T, action: Action) => T;

const animeListReducer: Reducer<Record<AnimeStatus, AnimeListState>> = (
  current,
  action
) => {
  switch (action.type) {
    case "clear-data":
      return EMPTY_LISTS;
    case "anime-loading-finished":
      return {
        ...current,
        [action.status]: {
          entries: current[action.status].entries.extend(action.list),
          isLoading: false,
        },
      };
    case "loading-anime-list":
      return {
        ...current,
        [action.status]: {
          ...current[action.status],
          isLoading: true,
        },
      };
    case "series-updating":
      return {
        ...current,
        [action.status]: {
          ...current[action.status],
          entries: current[action.status].entries.updateEntry(
            action.seriesId,
            action.update
          ),
        },
      };
    case "series-update-done":
      if (action.originalStatus != action.status) {
        return {
          ...current,
          [action.status]: {
            entries: [],
            status: "has_more_items",
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
        [action.status]: {
          ...current[action.status],
          entries: current[action.status].entries.updateEntry(action.seriesId, {
            status: action.status,
            assignedScore: action.score,
            episodesWatched: action.episodesWatched,
          }),
        },
      };
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
        currentList: action.status,
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
          series: action.series,
          acceptUpdate: action.acceptUpdate,
          rejectUpdate: action.rejectUpdate,
          currentStatus: action.currentStatus,
          newStatus: action.newStatus,
        },
      };
    case "set-theme":
      return { ...current, theme: action.theme };
    default:
      return {
        ...current,
        animeLists: animeListReducer(current.animeLists, action),
      };
  }
};
