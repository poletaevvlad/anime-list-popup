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

export const STATUSES: AnimeStatus[] = [
  AnimeStatus.Watching,
  AnimeStatus.Completed,
  AnimeStatus.OnHold,
  AnimeStatus.Dropped,
  AnimeStatus.PlanToWatch,
];

export const STATUS_LABELS: Record<AnimeStatus, string> = {
  [AnimeStatus.Watching]: "Currently Watching",
  [AnimeStatus.Completed]: "Completed",
  [AnimeStatus.OnHold]: "On Hold",
  [AnimeStatus.Dropped]: "Dropped",
  [AnimeStatus.PlanToWatch]: "Plan to Watch",
};

export { default as User } from "./user";
export { default as Series } from "./series";
export { AnimeListEntry, AnimeList, SeriesUpdate, SeriesStatus } from "./list";
