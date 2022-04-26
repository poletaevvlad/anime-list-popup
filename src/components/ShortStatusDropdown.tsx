import * as React from "react";
import { AnimeStatus } from "../model";
import { DropdownIcon } from "./Dropdown";
import { statusLabels } from "./StatusDropdown";

const shortStatusLabels: Record<AnimeStatus, string> = {
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
        {statusLabels.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <div className="current-value">{shortStatusLabels[props.value]}</div>
      <DropdownIcon />
    </div>
  );
};

export default ShortStatusDropdown;
