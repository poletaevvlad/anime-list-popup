import {
  SeriesUpdate,
  User,
  Series,
  AnimeList,
  AnimeListType,
  SeriesStatus,
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
  currentStatus: SeriesStatus;
}

export interface ApplicationState {
  user: User;
  currentList: AnimeListType;
  animeLists: Record<AnimeListType, AnimeListState>;
  query: string;
  updatingAnime: Set<number>;
  loadingCounter: number;
  errorMessage: ErrorMessage | null;
  statusSuggestion: StatusChangeSuggestion | null;
  theme: ThemeData;
}

export const EMPTY_LISTS: Record<AnimeListType, AnimeListState> = {
  [AnimeListType.Watching]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeListType.Completed]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeListType.OnHold]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeListType.Dropped]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeListType.PlanToWatch]: { entries: AnimeList.INITIAL, isLoading: false },
  [AnimeListType.SearchResults]: {
    entries: AnimeList.INITIAL,
    isLoading: false,
  },
};

export const INITIAL_STATE: ApplicationState = {
  user: null,
  currentList: AnimeListType.Watching,
  query: "Sket",
  animeLists: EMPTY_LISTS,
  updatingAnime: new Set<number>(),
  loadingCounter: 0,
  errorMessage: null,
  statusSuggestion: null,
  theme: ThemeData.DEFAULT_THEME,
};
