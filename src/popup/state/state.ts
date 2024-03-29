import {
  SeriesUpdate,
  User,
  AnimeList,
  AnimeListType,
  AnimeListEntry,
} from "../../model";
import AsyncDispatcher from "./asyncDispatcher";
import { Config } from "../../model/config";

export interface AnimeListState {
  entries: AnimeList;
  isLoading: boolean;
  isInvalid: boolean;
  version: number;
}

export interface ErrorMessage {
  title: string;
  message: string;
  retryAction: (dispatcher: AsyncDispatcher) => void;
}

export interface StatusChangeSuggestion {
  listEntry: AnimeListEntry;
  acceptUpdate: SeriesUpdate;
  rejectUpdate: SeriesUpdate;
}

export interface ApplicationState {
  user: User;
  currentList: AnimeListType;
  previousList: AnimeListType;
  animeLists: Record<AnimeListType, AnimeListState>;
  query: string;
  updatingAnime: Set<number>;
  loadingCounter: number;
  errorMessage: ErrorMessage | null;
  statusSuggestion: StatusChangeSuggestion | null;
  config: Config;
}

const initialListState: AnimeListState = {
  entries: AnimeList.INITIAL,
  isLoading: false,
  isInvalid: false,
  version: 0,
};

export const EMPTY_LISTS: Record<AnimeListType, AnimeListState> = {
  [AnimeListType.Watching]: initialListState,
  [AnimeListType.Completed]: initialListState,
  [AnimeListType.OnHold]: initialListState,
  [AnimeListType.Dropped]: initialListState,
  [AnimeListType.PlanToWatch]: initialListState,
  [AnimeListType.SearchResults]: initialListState,
};

export const INITIAL_STATE: ApplicationState = {
  user: null,
  currentList: AnimeListType.Watching,
  query: "",
  previousList: AnimeListType.Watching,
  animeLists: EMPTY_LISTS,
  updatingAnime: new Set<number>(),
  loadingCounter: 0,
  errorMessage: null,
  statusSuggestion: null,
  config: new Config(Config.DEFAULT),
};
