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

interface GrowableInputFieldProps {
    value: number;
    onChange: (value: number) => void
    autoFocus: boolean,
    onBlur: () => void,
    onFocus: () => void,
    fieldRef: React.MutableRefObject<HTMLInputElement>
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
            const newValue = event.target.value == ""
                ? 0
                : parseInt(event.target.value);
            props.onChange(newValue);
        }}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        ref={props.fieldRef} />
}

interface EpisodeSelectorProps {
    current: number;
    totalEpisodes: number;
    onChange: (value: number) => void
}


const EpisodeSelector = (props: EpisodeSelectorProps) => {
    const [focused, setFocused] = React.useState(false);
    const fieldRef = React.useRef<HTMLInputElement>(null);

    return <div
        className={"episode-selector" + (focused ? " focused" : "")}
        onClick={event => fieldRef.current.focus()}>
        <GrowableInputField
            value={props.current}
            onChange={props.onChange}
            autoFocus={focused}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            fieldRef={fieldRef} />
        /{props.totalEpisodes}
    </div>
}

export default EpisodeSelector;
