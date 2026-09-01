import React from 'react';
import { ArrowRight } from 'lucide-react';
import BokehBackground from './BokehBackground';

export default function SplashScreen({ onNext, onDirectDashboard }) {
  return (
    <div className="splash-container">
      <BokehBackground />

      {/* 4 Corner Geometric Rings matching Pic 4 */}
      <div className="corner-ring top-left"></div>
      <div className="corner-ring top-right"></div>
      <div className="corner-ring bottom-left"></div>
      <div className="corner-ring bottom-right"></div>

      <div className="splash-content">
        {/* Heart Logo with Silhouette Pair */}
        <div className="splash-logo-wrap">
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
            {/* Outer Heart Outline */}
            <path
              d="M50 82 C20 58 10 42 10 28 C10 16 20 8 32 8 C40 8 46 12 50 18 C54 12 60 8 68 8 C80 8 90 16 90 28 C90 42 80 58 50 82 Z"
              stroke="#731320"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Silhouette Left */}
            <circle cx="36" cy="30" r="6" fill="#731320" />
            <path d="M26 48 C26 39 33 39 36 39 C39 39 46 39 46 48 L46 54 L26 54 Z" fill="#731320" />
            {/* Silhouette Right */}
            <circle cx="64" cy="30" r="6" fill="#731320" />
            <path d="M54 48 C54 39 61 39 64 39 C67 39 74 39 74 48 L74 54 L54 54 Z" fill="#731320" />
            {/* Connected Handshake Arc */}
            <path d="M38 52 Q50 60 62 52" stroke="#731320" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="splash-title">SOUL SYNC</h1>
        <p className="splash-subtitle">CAPTURE, CHERISH, RELIVE.</p>
      </div>

      <div className="splash-bottom-bar">
        <div className="splash-progress-line">
          <div className="splash-progress-fill"></div>
        </div>
      </div>

      <button
        className="splash-next-btn"
        onClick={onNext}
        title="Begin Experience"
        aria-label="Next Step"
      >
        <ArrowRight size={22} />
      </button>
    </div>
  );
}
