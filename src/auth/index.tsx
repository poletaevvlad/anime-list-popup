import * as React from "react";
import { render } from "react-dom";
import LoginPrompt from "../components/LoginPrompt";

const Application = () => {
    return <LoginPrompt onLoginRequested={() => { }} />;
}

document.addEventListener("DOMContentLoaded", () => {
    render(<Application />, document.getElementById("app"));
});
