import API from "../../listdata/api";
import Action from "./actions";
import { ApplicationState } from "./state";

const middleware = (action: Action, state: ApplicationState, api: API): Action | null => {
    return action;
}

export default middleware;