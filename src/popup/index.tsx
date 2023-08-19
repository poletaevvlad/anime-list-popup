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
  ListSortOrder,
} from "../model";
import AsyncDispatcher from "./state/asyncDispatcher";
import UserMenuButton from "../components/UserMenuButton";
import StateChangeModal from "../components/StateChangeModal";
import ErrorModal from "../components/ErrorModal";
import { ThemeData } from "../model/theme";
import SearchField from "../components/SearchField";
import OrderingDropdown from "../components/OrderingDropdown";

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
      props.asyncDispatcher.loadAnimeList({
        listType,
        query: state.query,
        offset: 0,
        version: currentList.version,
        order: state.ordering,
      });
    }
  };

  const listOrderingChanged = (sortOrder: ListSortOrder) => {
    dispatch({ type: "list-sort-order-changed", sortOrder });
    props.asyncDispatcher.loadAnimeList({
      listType: state.currentList,
      query: state.query,
      offset: 0,
      version: state.animeLists[state.currentList].version + 1,
      order: sortOrder,
    });
  };

  const listScrolledToBottom = () => {
    const list = state.animeLists[state.currentList];
    if (!list.isLoading && !list.entries.isComplete) {
      props.asyncDispatcher.loadAnimeList({
        listType: state.currentList,
        query: state.query,
        offset: state.animeLists[state.currentList].entries.length,
        version: list.version,
        order: state.ordering,
      });
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
    props.asyncDispatcher.loadAnimeList({
      listType: state.currentList,
      query: state.query,
      offset: 0,
      version: state.animeLists[state.currentList].version + 1,
      order: state.ordering,
    });
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
    props.asyncDispatcher.loadAnimeList({
      listType: AnimeListType.SearchResults,
      query: searchQuery,
      offset: 0,
      version: state.animeLists[AnimeListType.SearchResults].version + 1,
      order: state.ordering,
    });
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
        props.asyncDispatcher.loadAnimeList({
          listType: state.previousList,
          query: "",
          offset: 0,
          version: state.animeLists[state.previousList].version,
          order: state.ordering,
        });
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
            {searchQuery == null ? (
              <OrderingDropdown
                value={state.ordering}
                enabled
                onChange={listOrderingChanged}
              />
            ) : null}
            <div
              className={
                "header-button icon-search" +
                (searchQuery != null && searchQuery.length < 3
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
              <SearchField
                query={searchQuery}
                setQuery={setSearchQuery}
                onSubmit={startSearch}
                onBlur={() =>
                  searchQuery.length == 0 &&
                  state.currentList != AnimeListType.SearchResults &&
                  setSearchQuery(null)
                }
              />
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
      <AnimeSeriesList
        enabled={modal == null}
        isLoading={currentList.isLoading}
        list={currentList.entries}
        watchScrolling={
          !currentList.entries.isComplete && !currentList.isLoading
        }
        isSearch={state.currentList == AnimeListType.SearchResults}
        isInvalid={currentList.isInvalid}
        onScrolledToBottom={listScrolledToBottom}
        disabledSeries={state.updatingAnime}
        onUpdate={episodeUpdated}
        currentListType={state.currentList}
      />
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
    dispatcher.loadAnimeList({
      listType: INITIAL_STATE.currentList,
      query: INITIAL_STATE.query,
      offset: 0,
      version: 0,
      order: INITIAL_STATE.ordering,
    });
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
