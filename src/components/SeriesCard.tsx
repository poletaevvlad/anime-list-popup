import * as React from "react";
import Dropdown from "./Dropdown";
import EpisodeSelector from "./EpisodeSelector";
import ShortStatusDropdown from "./ShortStatusDropdown";
import { AnimeStatus, Series } from "../model";

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
];

interface SeriesCardProps {
  series: Series;
  watched: number;
  assignedScore: number;
  enabled: boolean;
  displayedStatus: AnimeStatus;
  onScoreChanged: (newScore: number) => void;
  onEpisodesCountChanged: (newEpisodesCount: number) => void;
  onStatusChanged: (newStatus: AnimeStatus) => void;
}

const SeriesCard = (props: SeriesCardProps) => (
  <div className={props.enabled ? "card" : "card disabled"}>
    <div
      className="series-cover"
      style={
        props.series.coverUrl == null
          ? {}
          : {
              backgroundImage: `url(${props.series.coverUrl})`,
            }
      }
    />
    <div className="card-contents">
      <div className="series-description">
        <ShortStatusDropdown
          value={props.displayedStatus}
          onChange={props.onStatusChanged}
          enabled={props.enabled}
        />

        <div className="series-name">
          <a
            href={props.enabled ? props.series.pageUrl : null}
            title={props.series.name}
          >
            {props.series.name}
          </a>
        </div>
        <div className="series-english-name" title={props.series.englishName}>
          {props.series.englishName}
        </div>
      </div>
      <div className="series-controls">
        <div className="series-additional-info">
          <div className="series-season">{props.series.seasonFmt || ""}</div>
          <div className="series-score">
            {props.series.score != null
              ? `Score: ${props.series.score}`
              : "No score"}
          </div>
        </div>
        <Dropdown
          value={props.assignedScore.toString()}
          options={SCORE_LABELS}
          onChange={(value) => props.onScoreChanged(parseInt(value))}
          enabled={props.enabled}
        />
        <EpisodeSelector
          key={props.watched}
          current={props.watched}
          totalEpisodes={props.series.totalEpisodes}
          onChange={(value) => props.onEpisodesCountChanged(value)}
          enabled={props.enabled}
        />
      </div>
    </div>
  </div>
);

export default SeriesCard;
