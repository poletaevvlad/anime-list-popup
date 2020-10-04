import Action from "./actions";
import { ApplicationState } from "./state";

export type Dispatch = (action: Action) => void;
export type Reducer<T> =
    (currentState: T, action: Action, dispatch: Dispatch) => T;

export const rootReducer: Reducer<ApplicationState> =
    (current, action, dispatch) => {
        switch (action.type) {
            case "current-list-changed":
                return { ...current, currentList: action.status };
            case "user-info-loaded":
                return { ...current, userInfo: action.userInfo };
            default:
                return { ...current };
        }
    }