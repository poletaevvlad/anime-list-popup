import * as React from "react";

interface LoginPromptProps {
    onLoginRequested: () => void
}

const LoginPrompt = (props: LoginPromptProps) =>
    <div className="login-prompt">
        <div className="title">Login via MyAnimeList</div>
        <div className="subtitle">To access your anime list you need to login into your MyAnimeList account.</div>
        <button onClick={props.onLoginRequested}>Login</button>
    </div>

export default LoginPrompt;