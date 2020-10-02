import * as React from "react";
import { render } from "react-dom";
import ProgressIndicator from "../components/ProgressIndicator"

enum CurrentState {
    notAuthenticated, inProgress

}

const Application = () => {
    const [state, setState] = React.useState(CurrentState.notAuthenticated);

    function onLoginButtonPressed() {
        setState(CurrentState.inProgress);
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
