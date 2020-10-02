import { rootReducer } from "../reducers";
import { ApplicationState } from "../state";
import { UserInfoLoaded, CurrentListChanged } from "../actions";
import UserInfo from "../../../listdata/userinfo";

const state: ApplicationState = {
    isLoggedIn: true,
    userInfo: null,
    currentList: "watching",
    animeLists: {
        "watching": { entries: [], isLoading: false },
        "completed": { entries: [], isLoading: false },
        "on-hold": { entries: [], isLoading: false },
        "dropped": { entries: [], isLoading: false },
        "plan-to-watch": { entries: [], isLoading: false },
    }
}

test("changes user info", () => {
    const userInfo = new UserInfo("name", "url");
    const newState = rootReducer(state, new UserInfoLoaded(userInfo), jest.fn())
    expect(newState.userInfo).toBe(userInfo);
    expect(newState).not.toBe(state);
})

test("changes currently selected list", () => {
    const newState = rootReducer(state, new CurrentListChanged("dropped"), jest.fn())
    expect(newState.currentList).toBe("dropped");
})