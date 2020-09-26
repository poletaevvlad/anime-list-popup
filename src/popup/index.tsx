import * as React from "react";
import { render } from "react-dom";

function Application() {
    return <div>Hello, world</div>;
}

document.addEventListener("DOMContentLoaded", () => {
    render(<Application />, document.getElementById("app"));
});