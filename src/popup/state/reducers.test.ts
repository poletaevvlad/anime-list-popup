import { ApplicationState, INITIAL_STATE } from "./state";
import { rootReducer } from "./reducers";
import { Config } from "../../model/config";
import {
  AnimeList,
  AnimeListEntry,
  AnimeListType,
  AnimeStatus,
  ListSortOrder,
  Series,
  SeriesStatus,
} from "../../model";

const mockSeries = (
  name: string,
  id: number | undefined = undefined
): Series => {
  const seriesId =
    typeof id == "undefined" ? (Math.random() * 1000000) | 0 : id;
  return new Series({
    id: seriesId,
    name,
    englishName: name,
    totalEpisodes: 20,
    airingStatus: "finished_airing",
  });
};

const createConfig = ({
  order,
  completed = true,
  entries,
}: {
  order: ListSortOrder;
  completed?: boolean;
  entries: AnimeListEntry[];
}): ApplicationState => {
  let state = rootReducer(INITIAL_STATE, {
    type: "set-config",
    config: new Config({
      brightness: "light",
      color: "orange",
      listOrder: order,
    }),
  });
  state = rootReducer(state, {
    type: "loading-anime-list",
    listType: AnimeListType.Watching,
  });
  state = rootReducer(state, {
    type: "anime-loading-finished",
    listType: AnimeListType.Watching,
    list: new AnimeList(entries, completed),
    version: state.animeLists[AnimeListType.Watching].version,
  });

  return state;
};

const seriesNames = (state: ApplicationState): string[] =>
  state.animeLists[AnimeListType.Watching].entries.entries.map(
    (entry) => entry.series.name
  );

const makeEntry = (series: Series, score = 5) =>
  new AnimeListEntry({
    series,
    status: AnimeStatus.Watching,
    assignedScore: score,
    episodesWatched: 2,
  });

const reduceUpdaate = (
  state: ApplicationState,
  seriesId: number,
  update: Partial<SeriesStatus>
): ApplicationState => {
  const series = state.animeLists[
    AnimeListType.Watching
  ].entries.entries.filter((entry) => entry.series.id == seriesId)[0];
  const originalStatus = { ...series.seriesStatus };
  state = rootReducer(state, {
    type: "series-updating",
    seriesId,
    status: AnimeStatus.Watching,
    update,
  });
  state = rootReducer(state, {
    type: "series-update-done",
    seriesId,
    originalStatus: AnimeStatus.Watching,
    seriesStatus: { ...originalStatus, ...update },
  });
  return state;
};

describe("Series update reducers", () => {
  const series = [
    mockSeries("A", 10),
    mockSeries("B", 20),
    mockSeries("C", 30),
  ];

  for (const sortOrder of [
    ListSortOrder.Title,
    ListSortOrder.Score,
    ListSortOrder.StartDate,
    ListSortOrder.UpdatedAt,
  ]) {
    test(`Series removed when status changes (with sorting: ${sortOrder})`, () => {
      let state = createConfig({
        order: sortOrder,
        entries: series.map(makeEntry),
      });

      state = reduceUpdaate(state, 20, { status: AnimeStatus.Completed });
      expect(seriesNames(state)).toEqual(["A", "C"]);
    });
  }

  for (const [changedName, update] of [
    ["score", { assignedScore: 8 }],
    ["episodes watched", { episodesWatched: 10 }],
  ] as [string, Partial<SeriesStatus>][]) {
    for (const sortOrder of [ListSortOrder.Title, ListSortOrder.StartDate]) {
      test(`Series does not change position when ${changedName} changes (with sorting: ${sortOrder})`, () => {
        let state = createConfig({
          order: sortOrder,
          entries: series.map(makeEntry),
        });
        state = reduceUpdaate(state, 20, update);
        expect(seriesNames(state)).toEqual(["A", "B", "C"]);
      });

      test(`Series does not change position when ${changedName} changes in a list of size 1 (with sorting: ${sortOrder})`, () => {
        let state = createConfig({
          order: sortOrder,
          entries: [makeEntry(mockSeries("A", 20))],
        });
        state = reduceUpdaate(state, 20, update);
        expect(seriesNames(state)).toEqual(["A"]);
      });
    }

    test(`Series is moved to the top when ${changedName} changes (with sorting: list_update_at)`, () => {
      let state = createConfig({
        order: ListSortOrder.UpdatedAt,
        entries: series.map(makeEntry),
      });
      state = reduceUpdaate(state, 20, update);
      expect(seriesNames(state)).toEqual(["B", "A", "C"]);
    });

    test(`Series is moved to the top when ${changedName} changes in a list of size 1 (with sorting: list_update_at)`, () => {
      let state = createConfig({
        order: ListSortOrder.UpdatedAt,
        entries: [makeEntry(mockSeries("A", 20))],
      });
      state = reduceUpdaate(state, 20, update);
      expect(seriesNames(state)).toEqual(["A"]);
    });
  }

  describe("placement of series after score changes in a list sorted by score", () => {
    const entries = [
      makeEntry(mockSeries("A", 10), 5),
      makeEntry(mockSeries("B", 40), 5),
      makeEntry(mockSeries("C", 20), 4),
      makeEntry(mockSeries("D", 30), 4),
      makeEntry(mockSeries("E", 60), 3),
    ];

    test("places in the known portion of the list", () => {
      let state = createConfig({ order: ListSortOrder.Score, entries });
      state = reduceUpdaate(state, 30, { assignedScore: 5 });
      expect(seriesNames(state)).toEqual(["A", "D", "B", "C", "E"]);
    });

    test("places at the end if the entire list is loaded", () => {
      let state = createConfig({ order: ListSortOrder.Score, entries });
      state = reduceUpdaate(state, 30, { assignedScore: 2 });
      expect(seriesNames(state)).toEqual(["A", "B", "C", "E", "D"]);
    });

    test("removes the element if the placement in an unloaded portion", () => {
      let state = createConfig({
        order: ListSortOrder.Score,
        entries,
        completed: false,
      });
      state = reduceUpdaate(state, 30, { assignedScore: 2 });
      expect(seriesNames(state)).toEqual(["A", "B", "C", "E"]);
    });
  });
});
