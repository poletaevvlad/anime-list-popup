import Auth from "./auth";
import UserInfo from "./userinfo";
import SeriesInfo from "./seriesinfo";
import { constructUrl } from "./auth";

export type AnimeStatus = "watching" | "completed" | "on-hold" | "dropped" | "plan-to-watch";

const apiStatusNames: { [key in AnimeStatus]: string } = {
    "watching": "watching",
    "completed": "completed",
    "on-hold": "on_hold",
    "dropped": "dropped",
    "plan-to-watch": "plan_to_watch",
}

interface AnimeListResponse {
    hasMoreEntries: boolean,
    entries: AnimeListEntry[]
}

export interface AnimeListEntry {
    series: SeriesInfo;
    episodesWatched: number;
    assignedScore: number;
    status: AnimeStatus
}


type SeasonObject = {
    season: string
    year: number
}

function formatSeason(season: SeasonObject): string {
    const seasonName = season.season.charAt(0).toUpperCase() + season.season.substring(1);
    return seasonName + " " + season.year.toString();
}

export type SeriesUpdate = {
    episodesWatched?: number
    assignedScore?: number
    status?: AnimeStatus
}

export type SeriesUpdateResult = {
    status: AnimeStatus
    score: number
    episodesWatched: number
}

export default class API {
    private auth: Auth;

    constructor(auth: Auth) {
        this.auth = auth;
    }

    private async makeApiCall(
        url: string,
        options: { method?: string, body?: any }
    ): Promise<any> {
        const token = await this.auth.getToken()
        const response = await fetch(url, {
            method: options.method || "GET",
            body: options.body,
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const json = await response.json();
        if (typeof (json["error"]) != "undefined") {
            return Promise.reject("Error: " + json["message"])
        }
        return json
    }

    async getUserInfo(): Promise<UserInfo> {
        const data = await this.makeApiCall("https://api.myanimelist.net/v2/users/@me", {});
        return new UserInfo(data["name"] as string, data["picture"] as string);
    }

    async getAnimeList(status: AnimeStatus, offset: number): Promise<AnimeListResponse> {
        const url = constructUrl("https://api.myanimelist.net/v2/users/@me/animelist", {
            "status": apiStatusNames[status],
            "offset": offset.toString(),
            "limit": "25",
            "fields": "alternative_titles,num_episodes,mean,my_list_status{num_episodes_watched,score},start_season",
        });
        const values = await this.makeApiCall(url, {});
        return {
            hasMoreEntries: typeof (values.paging.next) != "undefined",
            entries: values.data.map((item: any) => {
                const node: any = item.node;
                return {
                    episodesWatched: node.my_list_status.num_episodes_watched,
                    assignedScore: node.my_list_status.score,
                    status: status,
                    series: new SeriesInfo({
                        id: node.id,
                        name: node.title,
                        englishName: node.alternative_titles.en,
                        score: node.mean,
                        coverUrl: node.main_picture.medium,
                        totalEpisodes: node.num_episodes,
                        season: formatSeason(node.start_season),
                    }),
                }
            })
        }
    }

    async updateAnimeEntry(
        seriesId: number,
        update: SeriesUpdate
    ): Promise<SeriesUpdateResult> {
        const url = "https://api.myanimelist.net/v2/anime/" + seriesId.toString() + "/my_list_status";
        const data = new URLSearchParams();
        if (typeof (update.assignedScore) != "undefined") {
            data.append("score", update.assignedScore.toString());
        }
        if (typeof (update.episodesWatched) != "undefined") {
            data.append("num_watched_episodes", update.episodesWatched.toString());
        }
        if (typeof (update.status) != "undefined") {
            data.append("status", apiStatusNames[update.status])
        }
        const response = await this.makeApiCall(url, { method: "PATCH", body: data });
        return {
            status: Object.keys(apiStatusNames).find(
                (key: AnimeStatus) => apiStatusNames[key] == response.status) as AnimeStatus,
            score: response.score,
            episodesWatched: response.num_episodes_watched,
        }
    }
}