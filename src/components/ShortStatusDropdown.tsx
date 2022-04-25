import * as React from "react";
import { AnimeStatus } from "../listdata/api";
import { DropdownIcon } from "./Dropdown";
import { statusLabels } from "./StatusDropdown";

const shortStatusLabels: { [key in AnimeStatus]: string } = {
  watching: "CW",
  completed: "Cm",
  "on-hold": "OH",
  dropped: "Dr",
  "plan-to-watch": "PW",
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
