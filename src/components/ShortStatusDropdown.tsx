import * as React from "react";
import { AnimeStatus, STATUSES, LIST_TYPE_LABELS } from "../model";
import { DropdownIcon } from "./Dropdown";

const SHORT_STATUS_LABELS: Record<AnimeStatus, string> = {
  [AnimeStatus.Watching]: "CW",
  [AnimeStatus.Completed]: "Cm",
  [AnimeStatus.OnHold]: "OH",
  [AnimeStatus.Dropped]: "Dr",
  [AnimeStatus.PlanToWatch]: "PW",
};

interface ShortStatusDropdownProps {
  value: AnimeStatus;
  onChange: (status: AnimeStatus) => void;
  enabled: boolean;
}

const ShortStatusDropdown = (props: ShortStatusDropdownProps) => {
  return (
    <div className="short-dropdown">
      <select
        disabled={!props.enabled}
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value as AnimeStatus)}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {LIST_TYPE_LABELS[status]}
          </option>
        ))}
      </select>
      <div className="current-value">{SHORT_STATUS_LABELS[props.value]}</div>
      <DropdownIcon />
    </div>
  );
};

export default ShortStatusDropdown;
