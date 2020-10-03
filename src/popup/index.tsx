import * as React from "react";
import { render } from "react-dom";
import { ApplicationState } from "./state/state"
import { rootReducer } from "./state/reducers"
import { Action, CurrentListChanged } from "./state/actions"
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

    const reducer = (action: Action): ApplicationState => {
        const newAction = middleware(action, state, props.api);
        if (newAction == null) {
            return state;
        }
        return rootReducer(state, newAction, reducer);
    }

    [state, dispatch] = React.useReducer<React.Reducer<ApplicationState, Action>>(reducer, initialValue);

    return <div>
        <div className="header-bar">
            <StatusDropdown
                value={state.currentList}
                onChange={(value) => dispatch(new CurrentListChanged(value))} />
        </div>
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