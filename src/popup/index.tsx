import * as React from "react";
import { render } from "react-dom";
import { ApplicationState, INITIAL_STATE } from "./state/state";
import { rootReducer } from "./state/reducers";
import StatusDropdown from "../components/StatusDropdown";
import AnimeSeriesList from "../components/AnimeSeriesList";
import Auth from "../listdata/auth";
import { browser } from "webextension-polyfill-ts";
import AuthToken from "../listdata/token";
import API, { AnimeStatus } from "../listdata/api";
import AsyncDispatcher from "./state/asyncDispatcher";

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

    return <div>
        <div className="header-bar">
            <StatusDropdown value={state.currentList} onChange={currentListChanged} />
        </div>
        <AnimeSeriesList
            isLoading={state.animeLists[state.currentList].status == "loading"}
            entries={state.animeLists[state.currentList].entries} />
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
        render(
            <Application asyncDispatcher={dispatcher} />,
            document.getElementById("app")
        );
    });
});