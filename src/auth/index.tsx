import * as React from "react";
import { render } from "react-dom";

const Application = () => {
    return <div>auth</div>;
}

document.addEventListener("DOMContentLoaded", () => {
    render(<Application />, document.getElementById("app"));
});
