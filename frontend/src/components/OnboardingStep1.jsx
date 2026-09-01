import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function OnboardingStep1({ onNext, onSkip }) {
  return (
    <div className="onboarding-screen-wrap">
      <div className="step1-card-container">
        {/* Left Dark Panel */}
        <div className="step1-left-panel">
          {/* Wireframe overlapping cards illustration */}
          <div className="step1-wireframe-art">
            <div className="step1-wireframe-card-1">
              <div className="wireframe-inner-line"></div>
            </div>
            <div className="step1-wireframe-card-2">
              <div className="wireframe-inner-line"></div>
            </div>
          </div>

          <div className="step1-left-meta">
            <p className="step1-left-tag">THE LIVING ARCHIVE</p>
            <h2 className="step1-left-quote">
              Preserving the <em>essence</em> of your family story.
            </h2>
            <div className="step1-left-footer-line">
              DIGITAL LEGACY
            </div>
          </div>
        </div>

        {/* Right Light Panel */}
        <div className="step1-right-panel">
          <div className="step1-top-nav">
            <div className="dot-indicators">
              <div className="dot-step active"></div>
              <div className="dot-step"></div>
              <div className="dot-step"></div>
            </div>
            <button className="skip-btn" onClick={onSkip}>
              SKIP
            </button>
          </div>

          <div className="step1-main-content">
            <p className="step-eyebrow">— 01 — INTRODUCTION</p>
            <h1 className="step1-heading">
              Capture <em>Moments</em> That Matter
            </h1>
            <p className="step1-description">
              Save the moments, big or small, and hold them forever. A dedicated sanctuary for your family's digital legacy.
            </p>
          </div>

          <button
            className="circle-nav-btn"
            onClick={onNext}
            title="Next Step"
            aria-label="Next Step"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
