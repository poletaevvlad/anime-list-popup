import * as schema from "./api_schema";

export interface Season {
  year: number;
  season: string;
}

export default class Series {
  readonly id: number;
  readonly name: string;
  readonly englishName: string;
  readonly score?: number;
  readonly coverUrl?: string;
  readonly totalEpisodes: number;
  readonly season?: Season;

  constructor(props: {
    id: number;
    name: string;
    englishName: string;
    score?: number;
    coverUrl?: string;
    totalEpisodes: number;
    season?: Season;
  }) {
    Object.assign(this, props);
  }

  static fromResponse(series: schema.Series) {
    return new Series({
      id: series.id,
      name: series.title,
      englishName: series.alternative_titles.en,
      score: series.mean,
      coverUrl: series.main_picture?.medium,
      totalEpisodes: series.num_episodes,
      season: series.start_season,
    });
  }

  get pageUrl(): string {
    return `https://myanimelist.net/anime/${this.id}`;
  }

  get editPageUrl(): string {
    return `https://myanimelist.net/ownlist/anime/${this.id}/edit`;
  }

  get seasonFmt(): string | null {
    if (!this.season) {
      return null;
    }
    const seasonName =
      this.season.season.charAt(0).toUpperCase() +
      this.season.season.substring(1);
    return `${seasonName} ${this.season.year}`;
  }
}
