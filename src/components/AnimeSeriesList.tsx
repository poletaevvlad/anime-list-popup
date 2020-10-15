import * as React from "react";
import SeriesInfo from "../listdata/seriesinfo";
import SeriesCard from "./SeriesCard";
import ProgressIndicator from "./ProgressIndicator";
import { AnimeStatus } from "../listdata/api";

interface AnimeSeriesListProps {
    enabled: boolean
    isLoading: boolean
    watchScrolling: boolean
    onScrolledToBottom: () => void
    entries: {
        series: SeriesInfo;
        episodesWatched: number;
        assignedScore: number;
        status: AnimeStatus;
    }[]
    disabledSeries: Set<number>
    animeStatus: AnimeStatus
    onScoreChanged: (series: SeriesInfo, newScore: number) => void
    onWatchedEpisodesChanged: (series: SeriesInfo, currentNumEpisodes: number, numEpisodes: number) => void
    onStatusChanged: (series: SeriesInfo, newStatus: AnimeStatus) => void
}

const AnimeSeriesList = (props: AnimeSeriesListProps) => {
    function onScrolled(event: React.UIEvent<HTMLDivElement, UIEvent>) {
        const scrollTopMax = event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
        if (scrollTopMax - event.currentTarget.scrollTop < 300) {
            props.onScrolledToBottom()
        }
    }

    const scrollRef = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        scrollRef.current.scrollTo({ top: 0 });
    }, [props.animeStatus]);

    return <div className="anime-list content" ref={scrollRef}
        onScroll={props.watchScrolling ? onScrolled : undefined}>
        {props.entries.map(entry => {
            return <SeriesCard
                key={entry.series.id.toString()}
                seriesInfo={entry.series}
                displayedStatus={entry.status}
                watched={entry.episodesWatched}
                assignedScore={entry.assignedScore}
                enabled={props.enabled && !props.disabledSeries.has(entry.series.id)}
                onScoreChanged={(score) => props.onScoreChanged(entry.series, score)}
                onEpisodesCountChanged={(episodes) =>
                    props.onWatchedEpisodesChanged(entry.series, entry.episodesWatched, episodes)}
                onStatusChanged={(status) => props.onStatusChanged(entry.series, status)} />
        })}
        {props.isLoading
            ? <div className="anime-list-footer">
                <ProgressIndicator />
            </div>
            : null}

    </div>
}

export default AnimeSeriesList;
