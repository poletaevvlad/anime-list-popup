import * as React from "react";
import SeriesInfo from "../../listdata/seriesinfo";
import Dropdown from "./Dropdown";
import EpisodeSelector from "./EpisodeSelector";

const SCORE_LABELS = [
    { key: "0", label: "Select" },
    { key: "10", label: "10. Masterpiece" },
    { key: "9", label: "9. Great" },
    { key: "8", label: "8. Very Good" },
    { key: "7", label: "7. Good" },
    { key: "6", label: "6. Fine" },
    { key: "5", label: "5. Average" },
    { key: "4", label: "4. Bad" },
    { key: "3", label: "3. Very Bad" },
    { key: "2", label: "2. Horrible" },
    { key: "1", label: "1. Appalling" },
]

interface SeriesCardProps {
    seriesInfo: SeriesInfo
    watched: number
    assignedScore: number
}

const SeriesCard = (props: SeriesCardProps) =>
    <div className="card">
        <div className="series-cover" />
        <div className="series-description">
            <div className="series-name">{props.seriesInfo.name}</div>
            <div className="series-english-name">{props.seriesInfo.englishName}</div>
        </div>
        <div className="series-controls">
            <div className="series-additional-info">
                <div className="series-season">{props.seriesInfo.season}</div>
                <div className="series-score">Score: {props.seriesInfo.score}</div>
            </div>
            <Dropdown
                value={props.assignedScore.toString()}
                options={SCORE_LABELS}
                onChange={() => { }} />
            <EpisodeSelector
                current={props.watched}
                totalEpisodes={props.seriesInfo.totalEpisodes}
                onChange={() => { }} />
        </div>
    </div>

export default SeriesCard
