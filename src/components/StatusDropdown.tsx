import * as React from "react";
import { AnimeStatus } from "../model/api";
import Dropdown from "./Dropdown";

export const statusLabels: { key: AnimeStatus; label: string }[] = [
  { key: "watching", label: "Currently Watching" },
  { key: "completed", label: "Completed" },
  { key: "on-hold", label: "On Hold" },
  { key: "dropped", label: "Dropped" },
  { key: "plan-to-watch", label: "Plan to Watch" },
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
