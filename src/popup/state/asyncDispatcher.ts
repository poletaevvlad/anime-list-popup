import API, { SeriesUpdate } from "../../services/api";
import { AnimeStatus } from "../../model";
import UserInfo from "../../model/userinfo";
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

  loadAnimeList(status: AnimeStatus, offset: number) {
    this.dispatch({ type: "loading-anime-list", status: status });
    this.api.getAnimeList(status, offset).then(
      (result) => {
        this.dispatch({
          type: "anime-loading-finished",
          status: status,
          entries: result.entries,
          hasMoreEntries: result.hasMoreEntries,
        });
      },
      (error) => {
        this.dispatch({
          type: "set-error",
          title: "An error has occurred",
          message: String(error),
          retry: (self) => self.loadAnimeList(status, offset),
        });
      }
    );
  }

  loadUserInfo() {
    UserInfo.loadCached().then((cached) => {
      if (cached != null) {
        this.dispatch({
          type: "user-info-loaded",
          userInfo: cached,
        });
      }
      this.api.getUserInfo().then(
        (result) => {
          this.dispatch({
            type: "user-info-loaded",
            userInfo: result,
          });
          result.saveIntoCache();
        },
        (error) => {
          this.dispatch({
            type: "set-error",
            title: "An error has occurred",
            message: String(error),
            retry: (self) => self.loadUserInfo(),
          });
        }
      );
    });
  }

  updateSeries(seriesId: number, update: SeriesUpdate, status: AnimeStatus) {
    this.api.updateAnimeEntry(seriesId, update).then(
      (result) => {
        this.dispatch({
          type: "series-update-done",
          seriesId: seriesId,
          status: result.status,
          originalStatus: status,
          score: result.score,
          episodesWatched: result.episodesWatched,
        });
      },
      (error) => {
        this.dispatch({
          type: "set-error",
          title: "An error has occurred",
          message: String(error),
          retry: (self) => self.updateSeries(seriesId, update, status),
        });
      }
    );
  }
}

export default AsyncDispatcher;
