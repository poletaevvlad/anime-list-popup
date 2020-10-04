import * as React from "react";
import { render } from "react-dom";
import { ApplicationState } from "./state/state"
import { rootReducer } from "./state/reducers"
import Action from "./state/actions"
import StatusDropdown from "../components/StatusDropdown"
import Auth from "../listdata/auth";
import { browser } from "webextension-polyfill-ts";
import AuthToken from "../listdata/token";
import API from "../listdata/api";
import middleware from "./state/middleware";

interface ApplicationProps {
    api: API
}

const Application = (props: ApplicationProps) => {
    const initialValue: ApplicationState = {
        isLoggedIn: false,
        userInfo: null,
        currentList: "watching",
        animeLists: {
            "watching": { entries: [], status: "loading" },
            "completed": { entries: [], status: "loading" },
            "on-hold": { entries: [], status: "loading" },
            "dropped": { entries: [], status: "loading" },
            "plan-to-watch": { entries: [], status: "loading" },
        },
    }

    var state: ApplicationState;
    var dispatch: (action: Action) => void;

    const reducer = (state: ApplicationState, action: Action): ApplicationState => {
        const actions: Action[] = [action];
        while (actions.length > 0) {
            const action = actions.shift();
            const newAction = middleware(action, state, props.api);
            if (newAction == null) {
                continue;
            }
            state = rootReducer(state, newAction, actions.push);
        }
        return state;
    }

    const [state, dispatch] = React.useReducer(reducer, initialValue);

    return <div>
        <div className="header-bar">
            <StatusDropdown
                value={state.currentList}
                onChange={(value) => dispatch({ type: "current-list-changed", status: value })} />
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
        render(<Application api={api} />, document.getElementById("app"));
    });
});