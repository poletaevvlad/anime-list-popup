import * as React from "react";
import { render } from "react-dom";
import ProgressIndicator from "../components/ProgressIndicator"
import Auth from "../listdata/auth"
import { browser } from "webextension-polyfill-ts";

type CurrentState =
    { state: "not-authenticated" } |
    { state: "in-progress" } |
    { state: "error", message: string };


const Application = () => {
    const [state, setState] = React.useState<CurrentState>({ state: "not-authenticated" });

    function onLoginButtonPressed() {
        setState({ state: "in-progress" });
        Auth.launchAuthentication()
            .then(accessToken => accessToken.save())
            .then(() => {
                browser.tabs.getCurrent()
                    .then(tab => browser.tabs.remove(tab.id));
            })
            .catch((error) =>
                setState({ state: "error", message: String(error) })
            );
    }

    return <div className="login-prompt">
        <div className="title">Login via MyAnimeList</div>
        <div className="subtitle">To access your anime list you need to login into your MyAnimeList account.</div>
        {state.state == "in-progress"
            ? <div className="progress"><ProgressIndicator /></div>
            : <button onClick={onLoginButtonPressed}>Login</button>
        }
        {state.state == "error"
            ? <div className="error-msg">
                <div className="error-msg-title">An authentication error has occurred</div>
                <div className="error-msg-description">{state.message}</div>
            </div>
            : null
        }
    </div>
}

document.addEventListener("DOMContentLoaded", () => {
    render(<Application />, document.getElementById("app"));
});
