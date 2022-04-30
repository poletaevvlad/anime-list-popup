import * as React from "react";
import { AnimeStatus, STATUSES, STATUS_LABELS } from "../model";

export interface AddToListButtonProps {
  onClick: (status: AnimeStatus) => void;
}

const AddToListButton = (props: AddToListButtonProps) => (
  <div className="add-button">
    Add to List
    <select
      onChange={(event) => props.onClick(event.target.value as AnimeStatus)}
      value=""
    >
      <option value="" disabled hidden>
        Add to List
      </option>
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
    <div className="focus-border" />
  </div>
);

export default AddToListButton;
