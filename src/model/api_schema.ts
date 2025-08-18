import { AnimeStatus } from ".";
import { AiringStatus } from "./series";

export interface UserAnimeStatistics {
  num_items_watching: number;
  num_items_completed: number;
  num_items_on_hold: number;
  num_items_dropped: number;
  num_items_plan_to_watch: number;
  num_items: number;
  num_days_watched: number;
  num_days_watching: number;
  num_days_completed: number;
  num_days_on_hold: number;
  num_days_dropped: number;
  num_days: number;
  num_episodes: number;
  num_times_rewatched: number;
  mean_score: number;
}

export interface User {
  /**
   * GET /users/{user_name}
   */

  id: number;
  name: string;
  gender: string | null;
  location: string | null;
  joined_at: string;
  anime_statistics: UserAnimeStatistics | null;
  birthday: string | null;
  picture: string;
  time_zone: string | null;
  is_supporter: boolean | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  paging: {
    next?: string;
    previous?: string;
  };
}

export interface AnimeStatusEntry {
  status: AnimeStatus;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: string;
}

export interface Series {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  } | null;
  alternative_titles: {
    en: string | null;
    ja: string | null;
    synonims: string[] | null;
  } | null;
  num_episodes: number;
  mean: number | null;
  my_list_status: AnimeStatusEntry | null;
  start_season: { year: number; season: string } | null;
  status: AiringStatus;
}

export interface UserAnimeListEdge {
  /**
   * GET /users/{user_name}/animelist
   */

  node: Series;
}
