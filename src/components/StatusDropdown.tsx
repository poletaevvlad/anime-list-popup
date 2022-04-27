import * as React from "react";
import { AnimeListType, LIST_TYPE_LABELS, STATUSES } from "../model";
import Dropdown from "./Dropdown";

const STATUS_LABELS = STATUSES.map((status) => ({
  key: status,
  label: LIST_TYPE_LABELS[status],
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
      options={STATUS_LABELS}
      onChange={props.onChange}
      enabled={props.enabled}
    />
  );
};

export default StatusDropdown;
