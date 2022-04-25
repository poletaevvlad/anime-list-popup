import * as React from "react";
import { AnimeStatus } from "../model";
import Dropdown from "./Dropdown";

export const statusLabels: { key: AnimeStatus; label: string }[] = [
  { key: AnimeStatus.Watching, label: "Currently Watching" },
  { key: AnimeStatus.Completed, label: "Completed" },
  { key: AnimeStatus.OnHold, label: "On Hold" },
  { key: AnimeStatus.Dropped, label: "Dropped" },
  { key: AnimeStatus.PlanToWatch, label: "Plan to Watch" },
];

interface StatusDropdownProps {
  value: AnimeStatus;
  onChange: (value: AnimeStatus) => void;
  enabled: boolean;
}

const StatusDropdown = (props: StatusDropdownProps) => {
  return (
    <Dropdown
      value={props.value}
      options={statusLabels}
      onChange={props.onChange}
      enabled={props.enabled}
    />
  );
};

export default StatusDropdown;
