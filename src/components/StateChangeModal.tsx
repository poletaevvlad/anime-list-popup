import * as React from "react";
import { AnimeStatus } from "../model";
import { statusLabels } from "./StatusDropdown";

interface StateChangeModalProps {
  animeTitle: string;
  currentStatus: AnimeStatus;
  suggestedStatus: AnimeStatus;
  onAccepted: () => void;
  onRejected: () => void;
}

const StateChangeModal = (props: StateChangeModalProps) => {
  const currentStatusLabel = statusLabels.find(
    (e) => e.key == props.currentStatus
  ).label;
  const suggestedStatusLabel = statusLabels.find(
    (e) => e.key == props.suggestedStatus
  ).label;

  return (
    <div className="modal-background">
      <div className="modal">
        <div className="modal-title">
          Would you like to change the status of this anime?
        </div>
        <div className="modal-message">{props.animeTitle}</div>

        <div className="state-change-states">
          <div className="state-change-state">{currentStatusLabel}</div>
          <div className="state-change-arrow"></div>
          <div className="state-change-state">{suggestedStatusLabel}</div>
        </div>

        <div className="state-change-buttons">
          <button className="button" onClick={props.onRejected}>
            {`No, keep “${currentStatusLabel}”`}
          </button>
          <button
            className="button"
            onClick={props.onAccepted}
            autoFocus={true}
          >
            {`Yes, set to “${suggestedStatusLabel}”`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateChangeModal;
