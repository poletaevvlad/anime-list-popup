import * as React from "react";
import {
  AnimeListType,
  STATUS_LABELS,
  STATUSES,
  statusAsListType,
} from "../model";
import Dropdown from "./Dropdown";

const OPTIONS = STATUSES.map((status) => ({
  key: status,
  label: STATUS_LABELS[status],
}));

interface StatusDropdownProps {
  value: AnimeListType;
  onChange: (value: AnimeListType) => void;
  enabled: boolean;
  countByStatus: (status: AnimeListType) => number | null;
}

const StatusDropdown = (props: StatusDropdownProps) => {
  return (
    <Dropdown
      value={props.value}
      options={OPTIONS.map(({ key, label }) => {
        const count = props.countByStatus(statusAsListType(key));
        return { key, label: count == null ? label : `${label} (${count})` };
      })}
      onChange={props.onChange}
      enabled={props.enabled}
    />
  );
};

export default StatusDropdown;
