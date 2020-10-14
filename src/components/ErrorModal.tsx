import * as React from "react"

interface ErrorModalProps {
    title: string
    message: string
    onRetry: () => void
}

const ErrorModal = (props: ErrorModalProps) =>
    <div className="modal-background">
        <div className="modal error-modal">
            <div className="error-icon" />
            <div className="error-details">
                <div className="error-title">{props.title}</div>
                <div className="error-message">{props.message}</div>
                <button onClick={props.onRetry}>Retry</button>
            </div>
        </div>
    </div>

export default ErrorModal