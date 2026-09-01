import React from 'react';
import { ArrowRight, Volume2, Sparkles, ChevronDown } from 'lucide-react';

export default function OnboardingStep3({ onGetStarted, onOpenGallery }) {
  return (
    <div className="onboarding-screen-wrap">
      <div className="step3-container">
        {/* Left Column */}
        <div className="step3-left-col">
          <p className="step-eyebrow">PHASE 03 — CONNECTION</p>
          <h1 className="step3-heading">
            Relive the <em>Feelings.</em>
          </h1>
          <p className="step2-description">
            Memory isn't just about what happened; it's about how it felt. Our immersive archival system preserves the texture of your most significant moments.
          </p>

          {/* Feature Items */}
          <div className="step3-feature-item">
            <div className="step3-feature-icon">
              <Volume2 size={18} />
            </div>
            <div>
              <h4 className="step3-feature-title">Sensory Playback</h4>
              <p className="step3-feature-desc">
                Spatial audio and high-fidelity visuals.
              </p>
            </div>
          </div>

          <div className="step3-feature-item">
            <div className="step3-feature-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="step3-feature-title">Journaling AI</h4>
              <p className="step3-feature-desc">
                Context-aware prompts to deepen reflection.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="step3-actions-row">
            <button className="pill-journey-btn" onClick={onGetStarted}>
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
            <button className="gallery-link-btn" onClick={onOpenGallery || onGetStarted}>
              View Sample Gallery
            </button>
          </div>
        </div>

        {/* Right Column: Layered Polaroid Stack matching Pic 5 */}
        <div className="polaroid-stack-wrap">
          {/* Back Card (Lakehouse Retreat) */}
          <div className="polaroid-card back-lake">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              alt="Lakeside Sanctuary"
            />
          </div>

          {/* Main Hero Card (The Golden Hour Picnic) */}
          <div className="polaroid-card main-picnic">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85"
              alt="The Golden Hour Picnic"
            />
            <div className="picnic-caption-overlay">
              <p className="season">SUMMER 2023</p>
              <h3 className="title">The Golden Hour Picnic</h3>
            </div>
          </div>

          {/* Floating Memory Restored Badge */}
          <div className="memory-restored-pill">
            <span className="green-dot"></span>
            <span>MEMORY RESTORED</span>
          </div>

          {/* Foreground Bottom-Right Card (Vintage Handwritten Letter) */}
          <div className="polaroid-card letter-note">
            <img
              src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80"
              alt="Handwritten Letter"
            />
          </div>
        </div>

        {/* Bottom Bar: Indicators & Scroll Hint */}
        <div className="step2-bottom-bar">
          <div className="dot-indicators">
            <div className="dot-step"></div>
            <div className="dot-step"></div>
            <div className="dot-step active"></div>
          </div>

          <div className="scroll-explore-footer" onClick={onGetStarted}>
            <span>SCROLL TO EXPLORE FEATURES</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
