import React, { useState } from 'react';
import { ArrowRight, Camera, Video, Mic, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function OnboardingStep2({ onNext, onSkip }) {
  const [selectedFormats, setSelectedFormats] = useState({
    visual_arts: true,
    motion: true,
    oral_history: true,
    journaling: true
  });

  const toggleFormat = (key) => {
    setSelectedFormats(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="onboarding-screen-wrap">
      <div className="step2-container">
        {/* Left Column */}
        <div className="step2-left-col">
          <p className="step-eyebrow">STEP 02 — PERSONALIZATION</p>
          <h1 className="step2-heading">
            Your Story, <span className="green-accent">Your Way.</span>
          </h1>
          <p className="step2-description">
            Memories aren't just pixels. They are the sound of a laugh, the texture of a handwritten note, and the motion of a fleeting second. Choose how you preserve your legacy.
          </p>

          <button className="pill-journey-btn" onClick={onNext}>
            <span>Continue Journey</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Right 2x2 Grid of Preservation Formats */}
        <div className="step2-grid">
          {/* 1. Visual Arts */}
          <div
            className={`format-card ${selectedFormats.visual_arts ? 'selected' : ''}`}
            onClick={() => toggleFormat('visual_arts')}
          >
            <div className="format-top-row">
              <div className="format-icon-badge green">
                <Camera size={20} />
              </div>
              <div className="format-watermark">
                <ImageIcon size={36} />
              </div>
            </div>
            <h3 className="format-title">Visual Arts</h3>
            <p className="format-desc">
              High-fidelity photo preservation with intelligent color restoration.
            </p>
          </div>

          {/* 2. Motion */}
          <div
            className={`format-card ${selectedFormats.motion ? 'selected' : ''}`}
            onClick={() => toggleFormat('motion')}
          >
            <div className="format-top-row">
              <div className="format-icon-badge blue">
                <Video size={20} />
              </div>
              <div className="format-watermark">
                <Video size={36} />
              </div>
            </div>
            <h3 className="format-title">Motion</h3>
            <p className="format-desc">
              Cinematic video archives that capture the rhythm of life.
            </p>
          </div>

          {/* 3. Oral History */}
          <div
            className={`format-card ${selectedFormats.oral_history ? 'selected' : ''}`}
            onClick={() => toggleFormat('oral_history')}
          >
            <div className="format-top-row">
              <div className="format-icon-badge teal">
                <Mic size={20} />
              </div>
              <div className="format-watermark">
                <Mic size={36} />
              </div>
            </div>
            <h3 className="format-title">Oral History</h3>
            <p className="format-desc">
              Spatial audio recordings to keep voices alive for generations.
            </p>
          </div>

          {/* 4. Journaling */}
          <div
            className={`format-card ${selectedFormats.journaling ? 'selected' : ''}`}
            onClick={() => toggleFormat('journaling')}
          >
            <div className="format-top-row">
              <div className="format-icon-badge slate">
                <FileText size={20} />
              </div>
              <div className="format-watermark">
                <FileText size={36} />
              </div>
            </div>
            <h3 className="format-title">Journaling</h3>
            <p className="format-desc">
              The power of the written word, from quick notes to deep reflections.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Indicators & Sparkle button */}
        <div className="step2-bottom-bar">
          <div className="dot-indicators">
            <div className="dot-step"></div>
            <div className="dot-step active"></div>
            <div className="dot-step"></div>
          </div>

          <button className="sparkle-fab" onClick={onNext} title="Enhance Journey">
            <Sparkles size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
