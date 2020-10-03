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
    return <div className="anime-list">
        {props.entries.map(entry => {
            return <SeriesCard
                seriesInfo={entry.series}
                watched={entry.episodesWatched}
                assignedScore={entry.assignedScore} />
        })}
        <div className="anime-list-footer">
            <ProgressIndicator />
        </div>
    </div>
}

export default AnimeSeriesList;
