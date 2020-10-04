import API, { AnimeStatus, SeriesUpdate } from "../../listdata/api";
import Action from "./actions";
import { ApplicationState } from "./state";

class AsyncDispatcher {
    private actions: Action[];
    private listener: ((action: Action) => void) | null;
    private api: API;

    constructor(api: API) {
        this.api = api;
        this.actions = []
        this.listener = null
    }

    subscribe(listener: (action: Action) => void) {
        while (this.actions.length > 0) {
            listener(this.actions.shift());
        }
        this.listener = listener;
    }

    unsubscribe(listener: (action: Action) => void) {
        if (this.listener != listener) {
            console.error("Trying to remove listener different from the current listener");
        }
        this.listener = null;
    }

    private dispatch(action: Action) {
        if (this.listener == null) {
            this.actions.push(action);
        } else {
            this.listener(action);
        }
    }

    loadAnimeList(status: AnimeStatus, offset: number) {
        this.dispatch({ type: "loading-anime-list", status: status });
        this.api.getAnimeList(status, offset).then((result) => {
            this.dispatch({
                type: "anime-loading-finished",
                status: status,
                entries: result.entries,
                hasMoreEntries: result.hasMoreEntries,
            })
        });
    }

    loadUserInfo() {
        this.api.getUserInfo().then((result) => {
            this.dispatch({
                type: "user-info-loaded",
                userInfo: result
            });
        })
    }

    updateSeries(seriesId: number, update: SeriesUpdate) {
        this.api.updateAnimeEntry(seriesId, update).then(result => {
            this.dispatch({
                type: "series-update-done",
                seriesId: seriesId,
                status: result.status,
                score: result.score,
                episodesWatched: result.episodesWatched,
            })
        })
    }
}

export default AsyncDispatcher;