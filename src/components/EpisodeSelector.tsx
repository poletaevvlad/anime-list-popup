import * as React from "react";

const computeWidth = (content: string) => {
    const span = document.createElement("span");
    span.classList.add("episode-list-measurement")
    span.innerText = content;
    document.body.appendChild(span);
    const width = span.getBoundingClientRect().width;
    span.remove()
    return width;
}

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

interface GrowableInputFieldProps {
    value: number;
    onChange: (value: number) => void
    autoFocus: boolean,
    onBlur: () => void,
    onFocus: () => void,
    onSubmit: () => void,
    onCancel: () => void,
    fieldRef: React.MutableRefObject<HTMLInputElement>
    enabled: boolean
}

const GrowableInputField = (props: GrowableInputFieldProps) => {
    const valueString = props.value.toString()
    const width = computeWidth(valueString);
    return <input
        type="text"
        pattern="[0-9]+"
        placeholder="0"
        style={{ width: `${width}px` }}
        value={props.value == 0 ? "" : valueString}
        onChange={event => {
            const newValue = parseField(event.target.value);
            props.onChange(newValue);
        }}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        onKeyDown={event => {
            if (event.key == "Enter") {
                props.fieldRef.current.blur();
                event.preventDefault();
            } else if (event.key == "Escape") {
                props.onCancel();
                event.preventDefault();
            }
        }}
        ref={props.fieldRef}
        disabled={!props.enabled} />
}

interface EpisodeSelectorProps {
    current: number;
    totalEpisodes: number;
    onChange: (value: number) => void
    enabled?: boolean
}

const EpisodeSelector = (props: EpisodeSelectorProps) => {
    const [focused, setFocused] = React.useState(false);
    const [current, setCurrent] = React.useState(props.current);
    const fieldRef = React.useRef<HTMLInputElement>(null);

    return <div
        className={"episode-selector" + (focused ? " focused" : "")}
        onClick={event => fieldRef.current.focus()}>
        <GrowableInputField
            value={current}
            onChange={setCurrent}
            autoFocus={focused}
            onBlur={() => {
                setFocused(false);
                const value = Math.min(current, props.totalEpisodes);
                if (props.current != value) {
                    props.onChange(value);
                }
                setCurrent(value);
            }}
            onSubmit={() => fieldRef.current.blur()}
            onFocus={() => setFocused(true)}
            onCancel={() => setCurrent(props.current)}
            fieldRef={fieldRef}
            enabled={!!props.enabled} />
        /{props.totalEpisodes}
    </div>
}

export default EpisodeSelector;
