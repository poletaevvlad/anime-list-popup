import { AnimeStatus } from "../../listdata/api";
import UserInfo from "../../listdata/userinfo";
import { AnimeListEntry, SeriesUpdate } from "../../listdata/api";

type Action =
    { type: "current-list-changed", status: AnimeStatus } |
    { type: "user-info-loaded", userInfo: UserInfo } |
    { type: "loading-anime-list", status: AnimeStatus } |
    {
        type: "anime-loading-finished",
        status: AnimeStatus,
        entries: AnimeListEntry[],
        hasMoreEntries: boolean
    } |
    { type: "series-updating", seriesId: number, update: SeriesUpdate, status: AnimeStatus } |
    {
        type: "series-update-done",
        seriesId: number,
        status: AnimeStatus,
        episodesWatched: number,
        score: number
    };

export default Action;