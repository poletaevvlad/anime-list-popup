import {
  AnimeStatus,
  SeriesUpdate,
  User,
  Series,
  AnimeList,
} from "../../model";
import AsyncDispatcher from "./asyncDispatcher";
import { ThemeData } from "../../model/theme";

export interface AnimeListState {
  entries: AnimeList;
  isLoading: boolean;
}

export interface ErrorMessage {
  title: string;
  message: string;
  retryAction: (dispatcher: AsyncDispatcher) => void;
}

export interface StatusChangeSuggestion {
  series: Series;
  acceptUpdate: SeriesUpdate;
  rejectUpdate: SeriesUpdate;
  currentStatus: AnimeStatus;
  newStatus: AnimeStatus;
}

export interface ApplicationState {
  user: User;
  currentList: AnimeStatus;
  animeLists: Record<AnimeStatus, AnimeListState>;
  updatingAnime: Set<number>;
  loadingCounter: number;
  errorMessage: ErrorMessage | null;
  statusSuggestion: StatusChangeSuggestion | null;
  theme: ThemeData;
}

export const EMPTY_LISTS: Record<AnimeStatus, AnimeListState> = {
  [AnimeStatus.Watching]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeStatus.Completed]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeStatus.OnHold]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeStatus.Dropped]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeStatus.PlanToWatch]: { entries: AnimeList.INITIAL, isLoading: false },
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
