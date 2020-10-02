import { Action, CurrentListChanged, UserInfoLoaded } from "./actions";
import { ApplicationState } from "./state";

export type Dispatch = (action: Action) => void;
export type Reducer<T> =
    (currentState: T, action: Action, dispatch: Dispatch) => T;

export const rootReducer: Reducer<ApplicationState> =
    (current, action, dispatch) => {
        if (action instanceof CurrentListChanged) {
            return { ...current, currentList: action.newStatus }
        } else if (action instanceof UserInfoLoaded) {
            return { ...current, userInfo: action.userInfo }
        } else {
            return { ...current }
        }
    }