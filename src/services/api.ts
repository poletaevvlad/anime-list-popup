import Auth, { constructUrl } from "../services/auth";
import { User, AnimeListEntry, AnimeList, ListSortOrder } from "../model";
import * as schema from "../model/api_schema";
import { AnimeStatus, SeriesUpdate, SeriesStatus } from "../model";

type AnimeListResponse = schema.PaginatedResponse<schema.UserAnimeListEdge>;

export default class API {
  static readonly BASE_URL = "https://api.myanimelist.net/v2";

  constructor(private auth: Auth) {}

  private async makeApiCall<TResult>(
    url: string,
    { method = "GET", body }: { method?: string; body?: BodyInit } = {}
  ): Promise<TResult> {
    const token = await this.auth.getToken();
    const response = await fetch(url, {
      method,
      body,
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
    const data = await this.makeApiCall<schema.User>(
      `${API.BASE_URL}/users/@me`
    );
    return User.fromResponse(data);
  }

  private async requestAnime(
    endpoint: string,
    params: Record<string, string>,
    offset: number
  ): Promise<AnimeList> {
    const url = constructUrl(`${API.BASE_URL}/${endpoint}`, {
      ...params,
      offset: offset.toString(),
      limit: "25",
      fields:
        "alternative_titles,num_episodes,mean,my_list_status{num_episodes_watched,score},start_season,status",
      nsfw: "true",
    });
    const values = await this.makeApiCall<AnimeListResponse>(url);

    return new AnimeList(
      values.data.map(({ node }) => AnimeListEntry.fromResponse(node)),
      !values.paging.next
    );
  }

  async getAnimeList(
    status: AnimeStatus,
    sort: ListSortOrder,
    offset: number
  ): Promise<AnimeList> {
    return this.requestAnime("users/@me/animelist", { status, sort }, offset);
  }

  async getSearchResults(query: string, offset: number): Promise<AnimeList> {
    return this.requestAnime(
      "anime",
      { q: query.trim().substring(0, 64) },
      offset
    );
  }

  async updateAnimeEntry(
    seriesId: number,
    update: SeriesUpdate
  ): Promise<SeriesStatus> {
    const url = `${API.BASE_URL}/anime/${seriesId}/my_list_status`;
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
    const response = await this.makeApiCall<schema.AnimeStatusEntry>(url, {
      method: "PATCH",
      body: data,
    });
    return {
      status: response.status as AnimeStatus,
      assignedScore: response.score,
      episodesWatched: response.num_episodes_watched,
    };
  }
}
