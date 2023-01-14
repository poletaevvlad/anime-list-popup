import {
  AnimeStatus,
  User,
  AnimeList,
  SeriesUpdate,
  SeriesStatus,
  AnimeListType,
  AnimeListEntry,
} from "../../model";
import AsyncDispatcher from "./asyncDispatcher";
import { ThemeData } from "../../model/theme";

type Action =
  | { type: "current-list-changed"; listType: AnimeListType }
  | { type: "user-info-loaded"; user: User }
  | { type: "loading-anime-list"; listType: AnimeListType }
  | {
      type: "anime-loading-finished";
      listType: AnimeListType;
      list: AnimeList;
      version: number;
    }
  | { type: "anime-list-invalid"; listType: AnimeListType }
  | {
      type: "series-updating";
      seriesId: number;
      update: SeriesUpdate;
      status: AnimeStatus;
    }
  | {
      type: "series-update-done";
      seriesId: number;
      originalStatus: AnimeStatus;
      seriesStatus: SeriesStatus;
    }
  | { type: "clear-data" }
  | {
      type: "set-error";
      title: string;
      message: string;
      retry: (dispatcher: AsyncDispatcher) => void;
    }
  | { type: "clear-error" }
  | {
      type: "set-suggestion";
      listEntry: AnimeListEntry;
      acceptUpdate: SeriesUpdate;
      rejectUpdate: SeriesUpdate;
    }
  | { type: "set-theme"; theme: ThemeData }
  | { type: "start-search"; query: string }
  | { type: "finish-search" };

export default Action;
