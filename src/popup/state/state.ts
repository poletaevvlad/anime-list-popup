import { AnimeListEntry, SeriesUpdate } from "../../services/api";
import { AnimeStatus, User } from "../../model";
import AsyncDispatcher from "./asyncDispatcher";
import SeriesInfo from "../../model/seriesinfo";
import { ThemeData } from "../../model/theme";

export interface AnimeList {
  entries: AnimeListEntry[];
  status: "loading" | "all_loaded" | "has_more_items";
}

export interface ErrorMessage {
  title: string;
  message: string;
  retryAction: (dispatcher: AsyncDispatcher) => void;
}

export interface StatusChangeSuggestion {
  series: SeriesInfo;
  acceptUpdate: SeriesUpdate;
  rejectUpdate: SeriesUpdate;
  currentStatus: AnimeStatus;
  newStatus: AnimeStatus;
}

export interface ApplicationState {
  user: User;
  currentList: AnimeStatus;
  animeLists: Record<AnimeStatus, AnimeList>;
  updatingAnime: Set<number>;
  loadingCounter: number;
  errorMessage: ErrorMessage | null;
  statusSuggestion: StatusChangeSuggestion | null;
  theme: ThemeData;
}

export const EMPTY_LISTS: Record<AnimeStatus, AnimeList> = {
  [AnimeStatus.Watching]: { entries: [], status: "has_more_items" },
  [AnimeStatus.Completed]: { entries: [], status: "has_more_items" },
  [AnimeStatus.OnHold]: { entries: [], status: "has_more_items" },
  [AnimeStatus.Dropped]: { entries: [], status: "has_more_items" },
  [AnimeStatus.PlanToWatch]: { entries: [], status: "has_more_items" },
};

export const INITIAL_STATE: ApplicationState = {
  user: null,
  currentList: AnimeStatus.Watching,
  animeLists: EMPTY_LISTS,
  updatingAnime: new Set<number>(),
  loadingCounter: 0,
  errorMessage: null,
  statusSuggestion: null,
  theme: ThemeData.DEFAULT_THEME,
};
