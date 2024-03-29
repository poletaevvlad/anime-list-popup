import * as React from "react";

const parseField = (value: string): number => {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    if (char >= "0" && char <= "9") {
      result = result * 10 + (char.charCodeAt(0) - "0".charCodeAt(0));
    }
  }
  return result;
};

interface EpisodeSelectorProps {
  current: number;
  totalEpisodes: number;
  onChange: (value: number) => void;
  enabled?: boolean;
}

const EpisodeSelector = (props: EpisodeSelectorProps) => {
  const [focused, setFocused] = React.useState(false);
  const [current, setCurrent] = React.useState<number | null>(props.current);
  const fieldRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={"episode-selector"}>
      <div
        className={"field" + (focused ? " focused" : "")}
        onClick={() => fieldRef.current.focus()}
      >
        <input
          value={current == null ? "" : current}
          ref={fieldRef}
          type="text"
          pattern="[0-9]+"
          onChange={(event) => {
            const value = event.currentTarget.value.trim();
            setCurrent(value == "" ? null : parseField(value));
          }}
          style={{ color: focused ? undefined : "transparent" }}
          autoFocus={focused}
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              event.currentTarget.blur();
              event.preventDefault();
            } else if (event.key == "Escape") {
              event.currentTarget.blur();
              setCurrent(props.current);
              event.preventDefault();
            }
          }}
          onBlur={() => {
            setFocused(false);
            if (current == null) {
              setCurrent(props.current);
              return;
            }
            if (props.current != current) {
              props.onChange(current);
            }
          }}
          onSubmit={() => fieldRef.current.blur()}
          onFocus={() => setFocused(true)}
          disabled={!props.enabled}
        />
        <div
          className="current-value"
          style={{ display: focused ? "none" : "block" }}
        >
          <span className="value">{props.current}</span>/
          {props.totalEpisodes == 0 ? "?" : props.totalEpisodes}
        </div>
      </div>
      <button
        className={
          "inc-button" +
          (!!props.enabled &&
          (props.current < props.totalEpisodes || props.totalEpisodes == 0)
            ? " enabled"
            : "")
        }
        disabled={
          !props.enabled ||
          (props.current >= props.totalEpisodes && props.totalEpisodes != 0)
        }
        onClick={() => {
          props.onChange(props.current + 1);
        }}
      />
    </div>
  );
};

export default EpisodeSelector;
