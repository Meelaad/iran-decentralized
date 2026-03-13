import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { crashed: false };
    }

    static getDerivedStateFromError() {
        return { crashed: true };
    }

    render() {
        if (!this.state.crashed) return this.props.children;

        return (
            <div className="eb-page">
                <div className="eb-bg-grid" />
                <div className="eb-scanline" />
                <div className="eb-inner">
                    <div className="eb-eyebrow">SYSTEM ERROR</div>
                    <div className="eb-hex">
                        <svg viewBox="0 0 80 80">
                            <polygon
                                points="40,2 78,21 78,59 40,78 2,59 2,21"
                                fill="rgba(10,14,21,0.9)"
                                stroke="rgba(255,100,100,0.4)"
                                strokeWidth="1.5"
                            />
                            <text x="40" y="47" textAnchor="middle" fontSize="26" fontWeight="700"
                                fill="#ff6b6b" fontFamily="intelone-mono, monospace">!</text>
                        </svg>
                    </div>
                    <h1 className="eb-title">Something went wrong</h1>
                    <p className="eb-subtitle">
                        An unexpected error occurred. The rest of the application is unaffected.
                    </p>
                    <div className="eb-actions">
                        <button
                            className="eb-btn"
                            onClick={() => this.setState({ crashed: false })}
                        >
                            ↺ TRY AGAIN
                        </button>
                        <a className="eb-btn eb-btn--secondary" href="/">
                            ← RETURN TO MAP
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
