import {
  AnimeStatus,
  User,
  Series,
  AnimeList,
  SeriesUpdate,
} from "../../model";
import AsyncDispatcher from "./asyncDispatcher";
import { ThemeData } from "../../model/theme";

type Action =
  | { type: "current-list-changed"; status: AnimeStatus }
  | { type: "user-info-loaded"; user: User }
  | { type: "loading-anime-list"; status: AnimeStatus }
  | {
      type: "anime-loading-finished";
      status: AnimeStatus;
      list: AnimeList;
    }
  | {
      type: "series-updating";
      seriesId: number;
      update: SeriesUpdate;
      status: AnimeStatus;
    }
  | {
      type: "series-update-done";
      seriesId: number;
      status: AnimeStatus;
      episodesWatched: number;
      score: number;
      originalStatus: AnimeStatus;
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
      series: Series;
      acceptUpdate: SeriesUpdate;
      rejectUpdate: SeriesUpdate;
      currentStatus: AnimeStatus;
      newStatus: AnimeStatus;
    }
  | { type: "set-theme"; theme: ThemeData };

export default Action;
