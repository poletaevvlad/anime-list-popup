import * as React from "react";
import { render } from "react-dom";
import ProgressIndicator from "../components/ProgressIndicator"
import Auth from "../listdata/auth"
import { browser } from "webextension-polyfill-ts";

enum CurrentState { notAuthenticated, inProgress, authenticationFailed }

const Application = () => {
    const [state, setState] = React.useState(CurrentState.notAuthenticated);

    function onLoginButtonPressed() {
        setState(CurrentState.inProgress);
        Auth.launchAuthentication()
            .then(accessToken => accessToken.save())
            .then(() => {
                browser.tabs.getCurrent()
                    .then(tab => browser.tabs.remove(tab.id));
            })
            .catch((error) => {
                console.error(error);
                setState(CurrentState.authenticationFailed);
            })
    }

    return <div className="login-prompt">
        <div className="title">Login via MyAnimeList</div>
        <div className="subtitle">To access your anime list you need to login into your MyAnimeList account.</div>
        {state == CurrentState.inProgress
            ? <div className="progress"><ProgressIndicator /></div>
            : <button onClick={onLoginButtonPressed}>Login</button>
        }
    </div>
}

document.addEventListener("DOMContentLoaded", () => {
    render(<Application />, document.getElementById("app"));
});
