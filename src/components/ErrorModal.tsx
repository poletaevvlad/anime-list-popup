import * as React from "react"

interface ErrorModalProps {
    title: string
    message: string
    onRetry: () => void
    onReload: () => void
    onLogIn: () => void
}

const ErrorModal = (props: ErrorModalProps) =>
    <div className="modal-background">
        <div className="modal error-modal">
            <div className="error-icon" />
            <div className="error-details">
                <div className="modal-title">{props.title}</div>
                <div className="modal-message">{props.message}</div>
                <div className="buttons-bar">
                    <button className="button primary" onClick={props.onRetry}>Retry</button>
                    <button className="link-button" onClick={props.onReload}>Reload</button>
                    <button className="link-button" onClick={props.onLogIn}>Log in again</button>
                </div>
            </div>
        </div>
    </div>

export default ErrorModal