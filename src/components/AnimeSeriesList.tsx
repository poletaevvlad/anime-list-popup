import * as React from "react";
import SeriesCard from "./SeriesCard";
import ProgressIndicator from "./ProgressIndicator";
import {
  AnimeList,
  AnimeListEntry,
  AnimeListType,
  SeriesUpdate,
} from "../model";

interface AnimeSeriesListProps {
  enabled: boolean;
  isLoading: boolean;
  watchScrolling: boolean;
  onScrolledToBottom: () => void;
  list: AnimeList;
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
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0 });
    }
  }, [props.currentListType]);

  if (!props.isLoading && props.list.isComplete && props.list.length == 0) {
    return <div className="anime-list empty-list">This list is empty</div>;
  }

  return (
    <div
      className="anime-list content"
      ref={scrollRef}
      onScroll={props.watchScrolling ? onScrolled : undefined}
    >
      {props.list.entries.map((entry) => {
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
