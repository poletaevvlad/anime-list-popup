import Auth, { constructUrl } from "../services/auth";
import { User, Series } from "../model";
import {
  UserResponse,
  PaginatedResponse,
  UserAnimeListEdge,
  AnimeStatusEntry,
} from "../model/api_schema";
import { AnimeStatus } from "../model";

interface AnimeListResponse {
  hasMoreEntries: boolean;
  entries: AnimeListEntry[];
}

export interface AnimeListEntry {
  series: Series;
  episodesWatched: number;
  assignedScore: number;
  status: AnimeStatus;
}

export type SeriesUpdate = {
  episodesWatched?: number;
  assignedScore?: number;
  status?: AnimeStatus;
};

export type SeriesUpdateResult = {
  status: AnimeStatus;
  score: number;
  episodesWatched: number;
};

export default class API {
  private auth: Auth;

  constructor(auth: Auth) {
    this.auth = auth;
  }

  private async makeApiCall<TResult>(
    url: string,
    options: { method?: string; body?: BodyInit }
  ): Promise<TResult> {
    const token = await this.auth.getToken();
    const response = await fetch(url, {
      method: options.method || "GET",
      body: options.body,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await response.json();
    if (typeof json["error"] != "undefined") {
      return Promise.reject(`Error: ${json["message"]} (${json["error"]})`);
    }
    return json as TResult;
  }

  async getUserInfo(): Promise<User> {
    const data = await this.makeApiCall<UserResponse>(
      "https://api.myanimelist.net/v2/users/@me",
      {}
    );
    return User.fromResponse(data);
  }

  async getAnimeList(
    status: AnimeStatus,
    offset: number
  ): Promise<AnimeListResponse> {
    const url = constructUrl(
      "https://api.myanimelist.net/v2/users/@me/animelist",
      {
        status,
        offset: offset.toString(),
        limit: "25",
        fields:
          "alternative_titles,num_episodes,mean,my_list_status{num_episodes_watched,score},start_season",
        nsfw: "true",
      }
    );
    const values = await this.makeApiCall<PaginatedResponse<UserAnimeListEdge>>(
      url,
      {}
    );
    return {
      hasMoreEntries: typeof values.paging.next != "undefined",
      entries: values.data.map(({ node }) => {
        return {
          episodesWatched: node.my_list_status.num_episodes_watched,
          assignedScore: node.my_list_status.score,
          status: status,
          series: Series.fromResponse(node),
        };
      }),
    };
  }

  async updateAnimeEntry(
    seriesId: number,
    update: SeriesUpdate
  ): Promise<SeriesUpdateResult> {
    const url =
      "https://api.myanimelist.net/v2/anime/" +
      seriesId.toString() +
      "/my_list_status";
    const data = new URLSearchParams();
    if (typeof update.assignedScore != "undefined") {
      data.append("score", update.assignedScore.toString());
    }
    if (typeof update.episodesWatched != "undefined") {
      data.append("num_watched_episodes", update.episodesWatched.toString());
    }
    if (typeof update.status != "undefined") {
      data.append("status", update.status);
    }
    const response = await this.makeApiCall<AnimeStatusEntry>(url, {
      method: "PATCH",
      body: data,
    });
    return {
      status: response.status as AnimeStatus,
      score: response.score,
      episodesWatched: response.num_episodes_watched,
    };
  }
}
