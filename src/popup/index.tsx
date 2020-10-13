import * as React from "react";
import { render } from "react-dom";
import { ApplicationState, INITIAL_STATE } from "./state/state";
import { rootReducer } from "./state/reducers";
import StatusDropdown from "../components/StatusDropdown";
import AnimeSeriesList from "../components/AnimeSeriesList";
import Auth from "../listdata/auth";
import { browser } from "webextension-polyfill-ts";
import AuthToken from "../listdata/token";
import API, { AnimeStatus, SeriesUpdate } from "../listdata/api";
import AsyncDispatcher from "./state/asyncDispatcher";
import UserMenuButton from "../components/UserMenuButton"
import ProgressIndicator from "../components/ProgressIndicator"
import ErrorModal from "../components/ErrorModal";

interface ApplicationProps {
    asyncDispatcher: AsyncDispatcher
}

const Application = (props: ApplicationProps) => {
    const [state, dispatch] = React.useReducer(rootReducer, INITIAL_STATE);
    React.useEffect(() => {
        props.asyncDispatcher.subscribe(dispatch);
        return () => props.asyncDispatcher.unsubscribe(dispatch);
    });

    const currentListChanged = (status: AnimeStatus) => {
        dispatch({ type: "current-list-changed", status: status });
        const currentList = state.animeLists[status];
        if (currentList.entries.length == 0 && currentList.status == "has_more_items") {
            props.asyncDispatcher.loadAnimeList(status, 0);
        }
    }

    const listScrolledToBottom = () => {
        if (state.animeLists[state.currentList].status == "has_more_items") {
            props.asyncDispatcher.loadAnimeList(
                state.currentList, state.animeLists[state.currentList].entries.length
            );
        }
    }

    const episodeUpdated = (seriesId: number, update: SeriesUpdate) => {
        dispatch({
            type: "series-updating",
            seriesId: seriesId,
            status: state.currentList,
            update: update,
        });
        props.asyncDispatcher.updateSeries(seriesId, update, state.currentList);
    }

    const refreshData = () => {
        dispatch({ type: "clear-data" });
        props.asyncDispatcher.loadAnimeList(state.currentList, 0);
    }

    const retryError = () => {
        dispatch({ type: "clear-error" })
        state.errorMessage.retryAction(props.asyncDispatcher);
    }

    const currentList = state.animeLists[state.currentList];
    return <div>
        {state.errorMessage == null ? null :
            <ErrorModal
                title={state.errorMessage.title}
                message={state.errorMessage.message}
                onRetry={retryError} />}
        <div className="header-bar-container">
            <div className="header-bar">
                <div className="header-right">
                    {state.loadingCounter > 0
                        ? <div className="header-progress"><ProgressIndicator /></div>
                        : <div className="header-button icon-refresh" tabIndex={0} onClick={refreshData} />}
                    {state.userInfo == null ? null : <UserMenuButton userInfo={state.userInfo} />}
                </div>
                <StatusDropdown value={state.currentList} onChange={currentListChanged} />
            </div>
        </div>
        {currentList.status == "all_loaded" && currentList.entries.length == 0
            ? <div className="anime-list empty-list">This list is empty</div>
            : <AnimeSeriesList
                isLoading={currentList.status == "loading"}
                entries={currentList.entries}
                watchScrolling={currentList.status == "has_more_items"}
                onScrolledToBottom={listScrolledToBottom}
                disabledSeries={state.updatingAnime}
                onScoreChanged={(id, score) => episodeUpdated(id, { assignedScore: score })}
                onWatchedEpisodesChanged={(id, episodes) => episodeUpdated(id, { episodesWatched: episodes })}
                onStatusChanged={(id, status) => episodeUpdated(id, { status: status })}
                animeStatus={state.currentList} />
        }
    </div>;
}

document.addEventListener("DOMContentLoaded", () => {
    AuthToken.load().then((token) => {
        if (token == null) {
            browser.tabs.create({ active: true, url: "/auth.html" });
            window.close();
            return;
        }

        const auth = new Auth(token);
        const api = new API(auth);
        const dispatcher = new AsyncDispatcher(api);
        dispatcher.loadAnimeList(INITIAL_STATE.currentList, 0);
        dispatcher.loadUserInfo();
        render(
            <Application asyncDispatcher={dispatcher} />,
            document.getElementById("app")
        );
    });
});
