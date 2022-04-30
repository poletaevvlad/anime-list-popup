import * as React from "react";
import SeriesCard from "./SeriesCard";
import ProgressIndicator from "./ProgressIndicator";
import { AnimeListEntry, AnimeListType, SeriesUpdate } from "../model";

interface AnimeSeriesListProps {
  enabled: boolean;
  isLoading: boolean;
  watchScrolling: boolean;
  onScrolledToBottom: () => void;
  entries: AnimeListEntry[];
  disabledSeries: Set<number>;
  currentListType: AnimeListType;
  onUpdate: (listEntry: AnimeListEntry, update: SeriesUpdate) => void;
}

const AnimeSeriesList = (props: AnimeSeriesListProps) => {
  function onScrolled(event: React.UIEvent<HTMLDivElement, UIEvent>) {
    const scrollTopMax =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
    if (scrollTopMax - event.currentTarget.scrollTop < 300) {
      props.onScrolledToBottom();
    }
  }

  const scrollRef = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    scrollRef.current.scrollTo({ top: 0 });
  }, [props.currentListType]);

  return (
    <div
      className="anime-list content"
      ref={scrollRef}
      onScroll={props.watchScrolling ? onScrolled : undefined}
    >
      {props.entries.map((entry) => {
        return (
          <SeriesCard
            key={entry.series.id.toString()}
            series={entry.series}
            displayedStatus={entry.status}
            watched={entry.episodesWatched}
            assignedScore={entry.assignedScore}
            enabled={
              props.enabled && !props.disabledSeries.has(entry.series.id)
            }
            onUpdate={(update) => props.onUpdate(entry, update)}
          />
        );
      })}
      {props.isLoading ? (
        <div className="anime-list-footer">
          <ProgressIndicator />
        </div>
      ) : null}
    </div>
  );
};

export default AnimeSeriesList;
