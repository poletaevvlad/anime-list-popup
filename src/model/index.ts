export enum AnimeStatus {
  Watching = "watching",
  Completed = "completed",
  OnHold = "on_hold",
  Dropped = "dropped",
  PlanToWatch = "plan_to_watch",
}

export enum AnimeListType {
  Watching = "watching",
  Completed = "completed",
  OnHold = "on_hold",
  Dropped = "dropped",
  PlanToWatch = "plan_to_watch",
  SearchResults = "search_results",
}

export const LIST_TYPES: AnimeListType[] = [
  AnimeListType.Watching,
  AnimeListType.Completed,
  AnimeListType.OnHold,
  AnimeListType.Dropped,
  AnimeListType.PlanToWatch,
  AnimeListType.SearchResults,
];

export const STATUSES: AnimeStatus[] = [
  AnimeStatus.Watching,
  AnimeStatus.Completed,
  AnimeStatus.OnHold,
  AnimeStatus.Dropped,
  AnimeStatus.PlanToWatch,
];

export const LIST_TYPE_LABELS: Record<AnimeListType, string> = {
  [AnimeListType.Watching]: "Currently Watching",
  [AnimeListType.Completed]: "Completed",
  [AnimeListType.OnHold]: "On Hold",
  [AnimeListType.Dropped]: "Dropped",
  [AnimeListType.PlanToWatch]: "Plan to Watch",
  [AnimeListType.SearchResults]: "Search Results",
};

export { default as User } from "./user";
export { default as Series } from "./series";
export { AnimeListEntry, AnimeList, SeriesUpdate, SeriesStatus } from "./list";
