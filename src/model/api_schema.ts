import { AnimeStatus } from ".";

export interface UserResponse {
  /**
   * GET /users/{user_name}
   */

  id: number;
  name: string;
  picture: string;
  gender: string | null;
  birthday: string | null;
  location: string | null;
  joined_at: string;
  anime_statistics: Record<string, unknown> | null;
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
}

export interface UserAnimeListEdge {
  /**
   * GET /users/{user_name}/animelist
   */

  node: Series;
}
