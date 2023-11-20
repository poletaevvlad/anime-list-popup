import { AnimeList, AnimeListType, ListSortOrder } from "../../model";
import Action from "./actions";
import { AnimeListState, ApplicationState, EMPTY_LISTS } from "./state";

export type Reducer<T, Current = T> = (
  currentState: Current,
  action: Action
) => T;

const animeListReducer: Reducer<
  Record<AnimeListType, AnimeListState>,
  ApplicationState
> = (currentState, action) => {
  const current = currentState.animeLists;
  switch (action.type) {
    case "clear-data": {
      const newLists: Record<AnimeListType, AnimeListState> = {
        ...EMPTY_LISTS,
      };
      for (const listType of Object.keys(current) as AnimeListType[]) {
        newLists[listType] = {
          ...newLists[listType],
          version: current[listType].version + 1,
        };
      }
      return newLists;
    }
    case "anime-loading-finished":
      if (action.version != current[action.listType].version) {
        return current;
      }
      return {
        ...current,
        [action.listType]: {
          ...current[action.listType],
          entries: current[action.listType].entries.extend(action.list),
          isLoading: false,
        },
      };
    case "anime-list-invalid":
      return {
        ...current,
        [action.listType]: {
          isLoading: false,
          isInvalid: true,
          entries: AnimeList.INITIAL,
          version: current[action.listType],
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
    case "series-update-done": {
      if (!action.originalStatus) {
        return {
          ...current,
          [action.seriesStatus.status]: {
            ...current[action.seriesStatus.status],
            entries: AnimeList.INITIAL,
            isLoading: false,
          },
        };
      }
      if (action.originalStatus != action.seriesStatus.status) {
        return {
          ...current,
          [action.seriesStatus.status]: {
            ...current[action.seriesStatus.status],
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

      const newList = current[action.seriesStatus.status].entries.updateEntry(
        action.seriesId,
        action.seriesStatus
      );
      if (currentState.currentList != AnimeListType.SearchResults) {
        switch (currentState.config.listOrder) {
          case ListSortOrder.UpdatedAt:
            newList.moveEntry(action.seriesId, () => true);
            break;
          case ListSortOrder.Score: {
            const currentScore = action.seriesStatus.assignedScore;
            newList.moveEntry(
              action.seriesId,
              (next) =>
                next.assignedScore < currentScore ||
                (next.assignedScore == currentScore &&
                  next.series.id > action.seriesId),
              {
                atEnd:
                  currentState.animeLists[currentState.currentList].entries
                    .isComplete,
              }
            );
            break;
          }
        }
      }
      return {
        ...current,
        [action.seriesStatus.status]: {
          ...current[action.seriesStatus.status],
          entries: newList,
        },
      };
    }
    case "start-search": {
      return {
        ...current,
        [AnimeListType.SearchResults]: {
          isLoading: false,
          isInvalid: false,
          entries: AnimeList.INITIAL,
          version: current[AnimeListType.SearchResults].version + 1,
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
        animeLists: animeListReducer(current, action),
      };
    case "series-update-done": {
      const updating = new Set(current.updatingAnime);
      updating.delete(action.seriesId);
      return {
        ...current,
        updatingAnime: updating,
        animeLists: animeListReducer(current, action),
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
    case "set-config":
      return { ...current, config: action.config };
    case "start-search": {
      const state = {
        ...current,
        query: action.query,
        animeLists: animeListReducer(current, action),
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
        animeLists: animeListReducer(current, action),
      };
  }
};
