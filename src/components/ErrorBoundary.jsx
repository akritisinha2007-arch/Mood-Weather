import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "Mood Weather error:",
      error,
      info
    );
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">

          <div
            className="error-icon"
            aria-hidden="true"
          >
            🌥️
          </div>

          <span className="eyebrow">
            TEMPORARY WEATHER INTERRUPTION
          </span>

          <h1>
            Something went off the radar.
          </h1>

          <p>
            We couldn't load your emotional weather
            right now. Please try again.
          </p>

          <button
            className="primary-button"
            onClick={this.handleRefresh}
          >
            Try again
          </button>

        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;