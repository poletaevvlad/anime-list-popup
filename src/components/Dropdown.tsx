import * as React from "react";

interface DropdownProps {
  value: string;
  options: { key: string; label: string }[];
  onChange: (value: string) => void;
  enabled?: boolean;
  invisible?: boolean;
  className?: string;
  title?: string;
}

export const DropdownIcon = () => (
  <svg width={7} height={5} className="icon">
    <path d="M0.5 0.5L3.5 3.5L6.5 0.5" />
  </svg>
);

const Dropdown = ({
  value,
  options,
  onChange,
  enabled = true,
  invisible = false,
  children,
  className = "",
  title,
}: React.PropsWithChildren<DropdownProps>) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div
      className={
        `dropdown ${className}` +
        (focused ? " focused" : "") +
        (invisible ? " invisible" : "")
      }
      title={title}
    >
      <select
        value={value}
        disabled={!enabled}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {options.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      {children}
      <DropdownIcon />
    </div>
  );
};

export default Dropdown;
