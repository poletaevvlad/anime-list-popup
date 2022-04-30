import * as React from "react";
import { render } from "react-dom";
import { INITIAL_STATE } from "./state/state";
import { rootReducer } from "./state/reducers";
import StatusDropdown from "../components/StatusDropdown";
import AnimeSeriesList from "../components/AnimeSeriesList";
import Auth, { AccessToken } from "../services/auth";
import * as browser from "webextension-polyfill";
import API from "../services/api";
import {
  User,
  SeriesUpdate,
  AnimeListType,
  AnimeStatus,
  AnimeListEntry,
} from "../model";
import AsyncDispatcher from "./state/asyncDispatcher";
import UserMenuButton from "../components/UserMenuButton";
import StateChangeModal from "../components/StateChangeModal";
import ErrorModal from "../components/ErrorModal";
import { ThemeData } from "../model/theme";

interface ApplicationProps {
  asyncDispatcher: AsyncDispatcher;
}

const Application = (props: ApplicationProps) => {
  const [state, dispatch] = React.useReducer(rootReducer, INITIAL_STATE);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    body.setAttribute("class", "popup " + state.theme.rootClassName);

    props.asyncDispatcher.subscribe(dispatch);
    return () => props.asyncDispatcher.unsubscribe(dispatch);
  });

  const currentListChanged = (listType: AnimeListType) => {
    dispatch({ type: "current-list-changed", listType });
    const currentList = state.animeLists[listType];
    if (
      currentList.entries.length == 0 &&
      !currentList.entries.isComplete &&
      !currentList.isLoading
    ) {
      props.asyncDispatcher.loadAnimeList(
        listType,
        state.query,
        0,
        currentList.version
      );
    }
  };

  const listScrolledToBottom = () => {
    const list = state.animeLists[state.currentList];
    if (!list.isLoading && !list.entries.isComplete) {
      props.asyncDispatcher.loadAnimeList(
        state.currentList,
        state.query,
        state.animeLists[state.currentList].entries.length,
        list.version
      );
    }
  };

  const episodeUpdated = (entry: AnimeListEntry, update: SeriesUpdate) => {
    if (Object.keys(update).join() == "episodesWatched") {
      let suggested: AnimeStatus | null = null;
      if (
        entry.series.totalEpisodes != 0 &&
        update.episodesWatched == entry.series.totalEpisodes
      ) {
        suggested = AnimeStatus.Completed;
      } else if (update.episodesWatched > entry.episodesWatched) {
        suggested = AnimeStatus.Watching;
      }

      if (suggested && suggested != entry.status) {
        dispatch({
          type: "set-suggestion",
          listEntry: entry,
          rejectUpdate: update,
          acceptUpdate: { ...update, status: suggested },
        });
        return;
      }
    }

    episodeUpdatedWithoutSuggestion(entry, update);
  };

  const episodeUpdatedWithoutSuggestion = (
    entry: AnimeListEntry,
    update: SeriesUpdate
  ) => {
    dispatch({
      type: "series-updating",
      seriesId: entry.series.id,
      status: entry.status,
      update: update,
    });
    props.asyncDispatcher.updateSeries(entry.series.id, update, entry.status);
  };

  const refreshData = () => {
    dispatch({ type: "clear-data" });
    props.asyncDispatcher.loadAnimeList(
      state.currentList,
      state.query,
      0,
      state.animeLists[state.currentList].version + 1
    );
  };

  const retryError = () => {
    dispatch({ type: "clear-error" });
    state.errorMessage.retryAction(props.asyncDispatcher);
  };

  const reloadError = () => {
    location.reload();
  };

  const logInError = () => {
    browser.tabs.create({ active: true, url: "/auth.html" });
    window.close();
  };

  const logOut = () =>
    Promise.all([AccessToken.logout(), User.removeFromCache()]).then(
      logInError
    );

  const changeTheme = (theme: ThemeData) => {
    dispatch({ type: "set-theme", theme: theme });
    theme.save();
  };

  const currentList = state.animeLists[state.currentList];

  let modal: React.ReactElement = null;
  if (state.errorMessage != null) {
    modal = (
      <ErrorModal
        title={state.errorMessage.title}
        message={state.errorMessage.message}
        onRetry={retryError}
        onReload={reloadError}
        onLogIn={logInError}
      />
    );
  } else if (state.statusSuggestion != null) {
    modal = (
      <StateChangeModal
        animeTitle={state.statusSuggestion.listEntry.series.name}
        suggestedStatus={state.statusSuggestion.acceptUpdate.status}
        currentStatus={state.statusSuggestion.listEntry.status}
        onAccepted={() =>
          episodeUpdatedWithoutSuggestion(
            state.statusSuggestion.listEntry,
            state.statusSuggestion.acceptUpdate
          )
        }
        onRejected={() =>
          episodeUpdatedWithoutSuggestion(
            state.statusSuggestion.listEntry,
            state.statusSuggestion.rejectUpdate
          )
        }
      />
    );
  }

  const [searchQuery, setSearchQuery] = React.useState(null);

  const startSearch = () => {
    if (searchQuery == null || searchQuery.length == 0) {
      return;
    }
    dispatch({ type: "start-search", query: searchQuery });
    props.asyncDispatcher.loadAnimeList(
      AnimeListType.SearchResults,
      searchQuery,
      0,
      state.animeLists[AnimeListType.SearchResults].version + 1
    );
  };

  const finishSearch = () => {
    if (state.currentList == AnimeListType.SearchResults) {
      dispatch({ type: "finish-search" });
      const list = state.animeLists[state.previousList];
      if (
        list.entries.length == 0 &&
        !list.entries.isComplete &&
        !list.isLoading
      ) {
        props.asyncDispatcher.loadAnimeList(
          state.previousList,
          "",
          0,
          state.animeLists[state.previousList].version
        );
      }
    }
    setSearchQuery(null);
  };

  return (
    <div className={isMenuOpen ? "notouch" : ""}>
      {modal}
      <div className="header-bar-container">
        <div
          className={
            searchQuery != null ? "header-bar search-mode" : "header-bar"
          }
        >
          <div className="header-right">
            <div
              className={
                "header-button icon-search" +
                (searchQuery != null && searchQuery.length == 0
                  ? " disabled"
                  : "")
              }
              onClick={() =>
                searchQuery == null ? setSearchQuery("") : startSearch()
              }
            />
            {modal != null || state.loadingCounter > 0 ? (
              <div className="header-button icon-refresh disabled" />
            ) : (
              <div
                className="header-button icon-refresh"
                tabIndex={0}
                onClick={refreshData}
                onKeyPress={(event) => event.key == "Enter" && refreshData()}
              />
            )}
            {modal != null || state.user == null ? (
              <div className="header-button icon-user-menu disabled" />
            ) : (
              <UserMenuButton
                user={state.user}
                onLogout={logOut}
                theme={state.theme}
                onThemeChanged={changeTheme}
                isOpened={isMenuOpen}
                setOpened={setMenuOpen}
                currentList={state.currentList}
              />
            )}
          </div>

          {searchQuery != null ? (
            <>
              <div
                className="header-button icon-back"
                onClick={() => finishSearch()}
              />
              <div className="search-bar">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyPress={(event) => event.key == "Enter" && startSearch()}
                  autoFocus
                  onBlur={() =>
                    searchQuery.length == 0 &&
                    state.currentList != AnimeListType.SearchResults &&
                    setSearchQuery(null)
                  }
                />
              </div>
            </>
          ) : (
            <StatusDropdown
              value={state.currentList}
              onChange={currentListChanged}
              enabled={state.updatingAnime.size == 0 && modal == null}
            />
          )}
        </div>
      </div>
      {!currentList.isLoading &&
      currentList.entries.isComplete &&
      currentList.entries.length == 0 ? (
        <div className="anime-list empty-list">This list is empty</div>
      ) : (
        <AnimeSeriesList
          enabled={modal == null}
          isLoading={currentList.isLoading}
          entries={currentList.entries.entries}
          watchScrolling={
            !currentList.entries.isComplete && !currentList.isLoading
          }
          onScrolledToBottom={listScrolledToBottom}
          disabledSeries={state.updatingAnime}
          onUpdate={episodeUpdated}
          currentListType={state.currentList}
        />
      )}
    </div>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  AccessToken.load().then((token) => {
    if (token == null) {
      browser.tabs.create({ active: true, url: "/auth.html" });
      window.close();
      return;
    }

    const auth = new Auth(token);
    const api = new API(auth);
    const dispatcher = new AsyncDispatcher(api);
    dispatcher.loadAnimeList(
      INITIAL_STATE.currentList,
      INITIAL_STATE.query,
      0,
      0
    );
    dispatcher.loadUser();
    dispatcher.dispatchLater(
      ThemeData.load().then((theme) => {
        return { type: "set-theme", theme: theme };
      })
    );
    render(
      <Application asyncDispatcher={dispatcher} />,
      document.getElementById("app")
    );
  });
});
