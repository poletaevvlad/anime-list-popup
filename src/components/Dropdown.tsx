import * as React from "react";

interface DropdownProps {
    value: string;
    options: { key: string, label: string }[];
    onChange: (value: string) => void;
}

const Dropdown = (props: DropdownProps) => {
    return <div className="dropdown">
        <select value={props.value}
            onChange={event => props.onChange(event.target.value)}>
            {props.options.map(({ key, label }) =>
                <option key={key} value={key}>{label}</option>
            )}
        </select>
        <svg width={7} height={5} className="icon">
            <path d="M0.5 0.5L3.5 3.5L6.5 0.5" />
        </svg>
    </div >
}

export default Dropdown;