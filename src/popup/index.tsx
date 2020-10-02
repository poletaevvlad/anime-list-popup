import * as React from "react";
import { render } from "react-dom";
import { ApplicationState } from "./state/state"
import { rootReducer } from "./state/reducers"
import { Action, CurrentListChanged } from "./state/actions"
import StatusDropdown from "./components/StatusDropdown"

function Application() {
    const initialValue: ApplicationState = {
        isLoggedIn: false,
        userInfo: null,
        currentList: "watching",
        animeLists: {
            "watching": { entries: [], isLoading: false },
            "completed": { entries: [], isLoading: false },
            "on-hold": { entries: [], isLoading: false },
            "dropped": { entries: [], isLoading: false },
            "plan-to-watch": { entries: [], isLoading: false },
        },
    }

    var state: ApplicationState;
    var dispatch: (action: Action) => void;

    const reducer = (action: Action): ApplicationState =>
        rootReducer(state, action, reducer);

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
    render(<Application />, document.getElementById("app"));
});