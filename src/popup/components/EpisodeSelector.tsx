import * as React from "react";

const computeWidth = (content: string) => {
    const span = document.createElement("span");
    span.innerText = content;
    document.body.appendChild(span);
    const width = span.getBoundingClientRect().width;
    span.remove()
    return width;
}

interface GrowableInputFieldProps {
    value: number;
    onChange: (value: number) => void
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
        }} />
}

interface EpisodeSelector {
    current: number;
    totalEpisodes: number;
    onChange: (value: number) => void
}


const EpisodeSelector = (props: EpisodeSelector) => {
    return <div className="episode-selector">
        <GrowableInputField value={props.current} onChange={props.onChange} />
    </div>
}

export default EpisodeSelector;
