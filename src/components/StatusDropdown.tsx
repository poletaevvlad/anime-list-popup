import * as React from "react";
import { AnimeListType, STATUS_LABELS, STATUSES } from "../model";
import Dropdown from "./Dropdown";

const OPTIONS = STATUSES.map((status) => ({
  key: status,
  label: STATUS_LABELS[status],
}));

interface StatusDropdownProps {
  value: AnimeListType;
  onChange: (value: AnimeListType) => void;
  enabled: boolean;
}

const StatusDropdown = (props: StatusDropdownProps) => {
  return (
    <Dropdown
      value={props.value}
      options={OPTIONS}
      onChange={props.onChange}
      enabled={props.enabled}
    />
  );
};

export default StatusDropdown;
