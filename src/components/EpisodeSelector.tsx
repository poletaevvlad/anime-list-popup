import * as React from "react";

const parseField = (value: string): number => {
    let result = 0;
    for (let i = 0; i < value.length; i++) {
        const char = value.charAt(i);
        if (char >= '0' && char <= '9') {
            result = result * 10 + (char.charCodeAt(0) - '0'.charCodeAt(0));
        }
    }
    return result;
}

interface EpisodeSelectorProps {
    current: number;
    totalEpisodes: number;
    onChange: (value: number) => void
    enabled?: boolean
}

const EpisodeSelector = (props: EpisodeSelectorProps) => {
    const [focused, setFocused] = React.useState(false);
    const [current, setCurrent] = React.useState<number | null>(props.current);
    const fieldRef = React.useRef<HTMLInputElement>(null);

    return <div className={"episode-selector"}>
        <div className={"field" + (focused ? " focused" : "")}
            onClick={event => fieldRef.current.focus()}>
            <input
                value={current == null ? "" : current}
                ref={fieldRef}
                type="text"
                pattern="[0-9]+"
                onChange={(event) => {
                    const value = event.currentTarget.value.trim()
                    setCurrent(value == "" ? null : parseField(value))
                }}
                style={{ color: focused ? undefined : "transparent" }}
                autoFocus={focused}
                onKeyDown={event => {
                    if (event.key == "Enter") {
                        event.currentTarget.blur()
                        event.preventDefault()
                    } else if (event.key == "Escape") {
                        event.currentTarget.blur()
                        setCurrent(props.current)
                        event.preventDefault()
                    }
                }}
                onBlur={(event) => {
                    setFocused(false)
                    const value = Math.min(current, props.totalEpisodes);
                    if (props.current != value) {
                        props.onChange(value);
                    }
                    setCurrent(value);
                }}
                onSubmit={() => fieldRef.current.blur()}
                onFocus={() => setFocused(true)}
                disabled={!props.enabled}
            />
            <div className="current-value" style={{ display: focused ? "none" : "block" }}>
                <span className="value">{props.current}</span>/{props.totalEpisodes}
            </div>
        </div>
        <button
            className={"inc-button" + (!!props.enabled && props.current < props.totalEpisodes ? " enabled" : "")}
            disabled={!props.enabled || props.current >= props.totalEpisodes}
            onClick={() => { props.onChange(props.current + 1) }} />
    </div>
}

export default EpisodeSelector;
