import { AnimeStatus } from "../../listdata/api";
import UserInfo from "../../listdata/userinfo";
import { AnimeListEntry } from "../../listdata/api";

type Action =
    { type: "current-list-changed", status: AnimeStatus } |
    { type: "user-info-loaded", userInfo: UserInfo } |
    { type: "loading-anime-list", status: AnimeStatus } |
    {
        type: "anime-loading-finished",
        status: AnimeStatus,
        entries: AnimeListEntry[],
        hasMoreEntries: boolean
    };

export default Action;