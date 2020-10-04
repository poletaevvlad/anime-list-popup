import * as React from "react";
import SeriesInfo from "../listdata/seriesinfo";
import SeriesCard from "./SeriesCard";
import ProgressIndicator from "./ProgressIndicator";

interface AnimeSeriesListProps {
    isLoading: boolean
    entries: {
        series: SeriesInfo;
        episodesWatched: number;
        assignedScore: number;
    }[]
}

const AnimeSeriesList = (props: AnimeSeriesListProps) => {
    return <div className="anime-list content">
        {props.entries.map(entry => {
            return <SeriesCard
                key={entry.series.id.toString()}
                seriesInfo={entry.series}
                watched={entry.episodesWatched}
                assignedScore={entry.assignedScore} />
        })}
        {props.isLoading
            ? <div className="anime-list-footer">
                <ProgressIndicator />
            </div>
            : null}

    </div>
}

export default AnimeSeriesList;
