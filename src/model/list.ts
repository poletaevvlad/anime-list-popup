import { AnimeStatus, Series } from ".";
import * as schema from "./api_schema";

export type SeriesUpdate = {
  episodesWatched?: number;
  assignedScore?: number;
  status?: AnimeStatus;
};

export class AnimeListEntry {
  public readonly series: Series;
  public readonly episodesWatched: number;
  public readonly assignedScore: number;
  public readonly status: AnimeStatus;

  constructor(params: {
    series: Series;
    episodesWatched: number;
    assignedScore: number;
    status: AnimeStatus;
  }) {
    Object.assign(this, params);
  }

  static fromResponse(response: schema.Series): AnimeListEntry {
    return new AnimeListEntry({
      series: Series.fromResponse(response),
      episodesWatched: response.my_list_status?.num_episodes_watched || 0,
      assignedScore: response.my_list_status?.score || 0,
      status: response.my_list_status?.status || AnimeStatus.PlanToWatch,
    });
  }

  update(update: SeriesUpdate): AnimeListEntry {
    return new AnimeListEntry({
      series: this.series,
      episodesWatched:
        typeof update.episodesWatched === "undefined"
          ? this.episodesWatched
          : update.episodesWatched,
      assignedScore:
        typeof update.assignedScore === "undefined"
          ? this.assignedScore
          : update.assignedScore,
      status:
        typeof update.status === "undefined" ? this.status : update.status,
    });
  }
}

export class AnimeList {
  static readonly INITIAL = new AnimeList([], false);

  constructor(
    readonly entries: AnimeListEntry[],
    readonly isComplete: boolean
  ) {}

  get length(): number {
    return this.entries.length;
  }

  extend(tail: AnimeList): AnimeList {
    return new AnimeList([...this.entries, ...tail.entries], tail.isComplete);
  }

  remove(seriesId: number): AnimeList {
    return new AnimeList(
      this.entries.filter((entry) => entry.series.id != seriesId),
      this.isComplete
    );
  }

  updateEntry(seriesId: number, update: SeriesUpdate): AnimeList {
    return new AnimeList(
      this.entries.map((entry) => {
        return entry.series.id == seriesId ? entry.update(update) : entry;
      }),
      this.isComplete
    );
  }
}
