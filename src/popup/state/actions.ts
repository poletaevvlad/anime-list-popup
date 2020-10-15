import { AnimeStatus } from "../../listdata/api";
import UserInfo from "../../listdata/userinfo";
import { AnimeListEntry, SeriesUpdate } from "../../listdata/api";
import AsyncDispatcher from "./asyncDispatcher"
import SeriesInfo from "../../listdata/seriesinfo";

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
        score: number,
        originalStatus: AnimeStatus,
    } |
    { type: "clear-data" } |
    { type: "set-error", title: string, message: string, retry: (dispatcher: AsyncDispatcher) => void } |
    { type: "clear-error" } |
    {
        type: "set-suggestion",
        series: SeriesInfo,
        acceptUpdate: SeriesUpdate
        rejectUpdate: SeriesUpdate
        currentStatus: AnimeStatus
        newStatus: AnimeStatus
    };

export default Action;