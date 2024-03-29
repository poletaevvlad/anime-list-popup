import { AnimeStatus, Series } from ".";
import * as schema from "./api_schema";

export type SeriesStatus = {
  episodesWatched: number;
  assignedScore: number;
  status: AnimeStatus;
};

export type SeriesUpdate = Partial<SeriesStatus>;

export class AnimeListEntry {
  public readonly series: Series;
  public readonly episodesWatched: number;
  public readonly assignedScore: number;
  public readonly status?: AnimeStatus;

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
      status: response.my_list_status?.status,
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

  get seriesStatus(): SeriesStatus {
    return {
      status: this.status,
      assignedScore: this.assignedScore,
      episodesWatched: this.episodesWatched,
    };
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

  moveEntry(
    seriesId: number,
    beforePredicate: (entry: AnimeListEntry) => boolean,
    { atEnd = true }: { atEnd?: boolean } = {}
  ) {
    const entryIndex = this.entries.findIndex(
      (entry) => entry.series.id == seriesId
    );
    if (entryIndex == -1) {
      return false;
    }

    const [entry] = this.entries.splice(entryIndex, 1);
    for (let i = 0; i < this.entries.length; i++) {
      if (beforePredicate(this.entries[i])) {
        this.entries.splice(i, 0, entry);
        return;
      }
    }

    if (atEnd) {
      this.entries.push(entry);
    }
  }
}
