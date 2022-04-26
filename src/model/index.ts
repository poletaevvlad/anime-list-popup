export enum AnimeStatus {
  Watching = "watching",
  Completed = "completed",
  OnHold = "on_hold",
  Dropped = "dropped",
  PlanToWatch = "plan_to_watch",
}

export { default as User } from "./user";
export { default as Series } from "./series";
export { AnimeListEntry, AnimeList, SeriesUpdate, SeriesStatus } from "./list";
