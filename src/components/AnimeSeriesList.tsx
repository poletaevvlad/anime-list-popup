import * as React from "react";
import SeriesInfo from "../listdata/seriesinfo";
import SeriesCard from "./SeriesCard";
import ProgressIndicator from "./ProgressIndicator";

interface AnimeSeriesListProps {
    isLoading: boolean
    watchScrolling: boolean
    onScrolledToBottom: () => void
    entries: {
        series: SeriesInfo;
        episodesWatched: number;
        assignedScore: number;
    }[]
}

const AnimeSeriesList = (props: AnimeSeriesListProps) => {
    function onScrolled(event: React.UIEvent<HTMLDivElement, UIEvent>) {
        const scrollTopMax = event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
        if (scrollTopMax - event.currentTarget.scrollTop < 300) {
            props.onScrolledToBottom()
        }
    }

    return <div className="anime-list content"
        onScroll={props.watchScrolling ? onScrolled : undefined}>
        {props.entries.map(entry => {
            return <SeriesCard
                key={entry.series.id.toString()}
                seriesInfo={entry.series}
                watched={entry.episodesWatched}
                assignedScore={entry.assignedScore}
                enabled={true} />
        })}
        {props.isLoading
            ? <div className="anime-list-footer">
                <ProgressIndicator />
            </div>
            : null}

    </div>
}

export default AnimeSeriesList;
