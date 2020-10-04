import { AnimeStatus } from "../../listdata/api";
import UserInfo from "../../listdata/userinfo";

type Action =
    { type: "current-list-changed", status: AnimeStatus } |
    { type: "user-info-loaded", userInfo: UserInfo };

export default Action;