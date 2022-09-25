import React, { Component, ErrorInfo, ReactNode } from "react";
import Modal from "./Modal";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error: ", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Modal>
          <h2>Oops, something went wrong!</h2>
          <button
            className="btn mt-10"
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
