import * as React from "react";
import { AnimeStatus } from "../listdata/api";
import Dropdown from "./Dropdown";

const statusLabels: { key: AnimeStatus, label: string }[] = [
    { key: "watching", label: "Currently Watching" },
    { key: "completed", label: "Completed" },
    { key: "on-hold", label: "On Hold" },
    { key: "dropped", label: "Dropped" },
    { key: "plan-to-watch", label: "Plan to Watch" },
]

interface StatusDropdownProps {
    value: AnimeStatus
    onChange: (value: AnimeStatus) => void
}

const StatusDropdown = (props: StatusDropdownProps) =>
    <Dropdown
        value={props.value}
        options={statusLabels}
        onChange={props.onChange}
        enabled={true} />

export default StatusDropdown;
