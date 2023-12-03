import { AnimeStatus } from ".";
import { AnimeList, AnimeListEntry } from "./list";
import Series from "./series";

const createList = (entries: [number, string][], completed = true): AnimeList =>
  new AnimeList(
    entries.map(
      ([id, name]) =>
        new AnimeListEntry({
          series: new Series({
            id,
            name,
            englishName: name,
            score: 6.5,
            totalEpisodes: 24,
            airingStatus: "finished_airing",
          }),
          episodesWatched: 5,
          assignedScore: 8,
          status: AnimeStatus.Completed,
        })
    ),
    completed
  );

const names = (list: AnimeList): string[] =>
  list.entries.map((entry) => entry.series.name);

describe("AnimeList", () => {
  describe("extend method", () => {
    it("extend method combines two lists", () => {
      const firstList = createList(
        [
          [1, "A"],
          [2, "B"],
          [3, "C"],
        ],
        false
      );
      const secondList = createList(
        [
          [4, "D"],
          [5, "E"],
          [6, "F"],
        ],
        false
      );

      const finalList = firstList.extend(secondList);
      expect(finalList.isComplete).toBeFalsy();
      expect(names(finalList)).toEqual(["A", "B", "C", "D", "E", "F"]);
    });

    it("uses second list's completed flag", () => {
      const firstList = createList([[1, "A"]], false);
      const secondList = createList([[2, "B"]], true);
      const finalList = firstList.extend(secondList);
      expect(finalList.isComplete).toBeTruthy();
    });
  });

  it("removes elements from the list", () => {
    const originalList = createList(
      [
        [1, "A"],
        [2, "B"],
        [3, "C"],
      ],
      false
    );

    const withoutRemoved = originalList.remove(2);
    expect(names(withoutRemoved)).toEqual(["A", "C"]);
  });

  describe("moveEntry method", () => {
    let originalList: AnimeList;

    beforeEach(() => {
      originalList = createList(
        [
          [1, "A"],
          [2, "B"],
          [3, "C"],
          [4, "D"],
        ],
        false
      );
    });

    it("places an element after another element", () => {
      originalList.moveEntry(2, (x) => x.series.name >= "D");
      expect(names(originalList)).toEqual(["A", "C", "B", "D"]);
    });

    it("places an element at the beginning", () => {
      originalList.moveEntry(3, () => true);
      expect(names(originalList)).toEqual(["C", "A", "B", "D"]);
    });

    it("places an element at the end", () => {
      originalList.moveEntry(2, () => false);
      expect(names(originalList)).toEqual(["A", "C", "D", "B"]);
    });

    it("places an element at the end with at end placement disabled", () => {
      originalList.moveEntry(2, () => false, { atEnd: false });
      expect(names(originalList)).toEqual(["A", "C", "D"]);
    });
  });
});
