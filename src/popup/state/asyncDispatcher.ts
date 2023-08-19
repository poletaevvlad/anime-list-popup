import API from "../../services/api";
import {
  AnimeStatus,
  User,
  SeriesUpdate,
  AnimeListType,
  ListSortOrder,
} from "../../model";
import Action from "./actions";

class BaseAsyncDispatcher<A> {
  private actions: A[] = [];
  private listener: ((action: A) => void) | null = null;

  protected dispatch(action: A) {
    if (this.listener == null) {
      this.actions.push(action);
    } else {
      this.listener(action);
    }
  }

  subscribe(listener: (action: A) => void) {
    while (this.actions.length > 0) {
      listener(this.actions.shift());
    }
    this.listener = listener;
  }

  unsubscribe(listener: (action: A) => void) {
    if (this.listener != listener) {
      console.error(
        "Trying to remove listener different from the current listener"
      );
    }
    this.listener = null;
  }

  dispatchLater(promise: Promise<A>) {
    promise.then((action) => {
      if (typeof action != "undefined" && action != null) {
        this.dispatch(action);
      }
    });
  }
}

class AsyncDispatcher extends BaseAsyncDispatcher<Action> {
  private api: API;

  constructor(api: API) {
    super();
    this.api = api;
  }

  loadAnimeList({
    listType,
    query,
    offset,
    version,
    order,
  }: {
    listType: AnimeListType;
    query: string;
    offset: number;
    version: number;
    order: ListSortOrder;
  }) {
    this.dispatch({ type: "loading-anime-list", listType });

    const listPromise =
      listType == AnimeListType.SearchResults
        ? this.api.getSearchResults(query, offset)
        : this.api.getAnimeList(
            listType as string as AnimeStatus,
            order,
            offset
          );
    listPromise.then(
      (list) => {
        this.dispatch({
          type: "anime-loading-finished",
          listType,
          list,
          version,
        });
      },
      (error) => {
        const message = String(error);
        if (message == "Error: invalid q (bad_request)") {
          this.dispatch({ type: "anime-list-invalid", listType });
        } else {
          this.dispatch({
            type: "set-error",
            title: "An error has occurred",
            message,
            retry: (self) =>
              self.loadAnimeList({ listType, query, offset, version, order }),
          });
        }
      }
    );
  }

  loadUser() {
    User.loadCached().then((cached) => {
      if (cached != null) {
        this.dispatch({
          type: "user-info-loaded",
          user: cached,
        });
      }
      this.api.getUserInfo().then(
        (result) => {
          this.dispatch({
            type: "user-info-loaded",
            user: result,
          });
          result.saveIntoCache();
        },
        (error) => {
          this.dispatch({
            type: "set-error",
            title: "An error has occurred",
            message: String(error),
            retry: (self) => self.loadUser(),
          });
        }
      );
    });
  }

  updateSeries(
    seriesId: number,
    update: SeriesUpdate,
    originalStatus: AnimeStatus
  ) {
    this.api.updateAnimeEntry(seriesId, update).then(
      (seriesStatus) => {
        this.dispatch({
          type: "series-update-done",
          seriesId,
          originalStatus,
          seriesStatus,
        });
      },
      (error) => {
        this.dispatch({
          type: "set-error",
          title: "An error has occurred",
          message: String(error),
          retry: (self) => self.updateSeries(seriesId, update, originalStatus),
        });
      }
    );
  }
}

export default AsyncDispatcher;
