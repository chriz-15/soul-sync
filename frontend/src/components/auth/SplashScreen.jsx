import React, { useState } from 'react';
import SoulEmblem from '../common/SoulEmblem';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

// Exactly 8 subtle, floating ambient particles distributed across the atmosphere
const PARTICLES = [
  { id: 1, x: 12, y: 22, size: 2.5, color: '#B98CFF', duration: 14, delay: 0 },
  { id: 2, x: 86, y: 18, size: 3, color: '#79D9FF', duration: 18, delay: 2 },
  { id: 3, x: 16, y: 68, size: 2, color: '#B98CFF', duration: 16, delay: 4 },
  { id: 4, x: 84, y: 72, size: 3.5, color: '#B98CFF', duration: 20, delay: 1 },
  { id: 5, x: 26, y: 38, size: 2, color: '#F5F3F7', duration: 15, delay: 3 },
  { id: 6, x: 76, y: 44, size: 2.5, color: '#79D9FF', duration: 19, delay: 5 },
  { id: 7, x: 10, y: 85, size: 3, color: '#B98CFF', duration: 17, delay: 2 },
  { id: 8, x: 88, y: 88, size: 2, color: '#F5F3F7', duration: 21, delay: 4 }
];

const SplashScreen = () => {
  const { navigateTo } = useApp();
  const [btnPressed, setBtnPressed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Transition handler for "ENTER SOUL SYNC"
  const handleEnterSoulSync = () => {
    if (isExiting) return;
    setIsExiting(true);
    setBtnPressed(true);

    setTimeout(() => {
      // Respect existing authenticated session state
      const token = localStorage.getItem('soulsync_token');
      const savedUser = localStorage.getItem('soul_sync_current_user');

      if (token && savedUser) {
        navigateTo('home');
      } else {
        navigateTo('login');
      }
    }, 350);
  };

  return (
    <div
      className={`splash-screen-container ${isExiting ? 'splash-exiting' : ''}`}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.5rem',
        textAlign: 'center',
        zIndex: 10,
        overflow: 'hidden',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ===================================================
          LIVING ATMOSPHERE & SOUL FLOW BACKGROUND SYSTEM
          =================================================== */}
      <div className="splash-aurora-backdrop" aria-hidden="true">
        {/* Layer 1, 2, 3: Deep Base Atmospheric Light Fields */}
        <div className="splash-aurora-orb splash-aurora-1" />
        <div className="splash-aurora-orb splash-aurora-2" />
        <div className="splash-aurora-orb splash-aurora-3" />

        {/* Layer 4: SOUL FLOW — Two Soft Luminous Energy Flows Moving Toward Center & Blending */}
        <div className="soul-flow-container">
          {/* Flow A: Moon Mint Stream */}
          <div className="soul-flow-stream soul-flow-cyan" />
          {/* Flow B: Soft Copper Peach / Warm Gold Stream */}
          <div className="soul-flow-stream soul-flow-magenta" />
          {/* Blending core where the flows interact */}
          <div className="soul-flow-blend-core" />
        </div>

        {/* Layer 5: Subtle Light Ribbons (Outer Margins, Soft Blur, Low Opacity) */}
        <div className="splash-light-ribbons">
          <svg className="splash-ribbon-svg splash-ribbon-left" viewBox="0 0 600 800" fill="none">
            <path
              d="M -50,60 C 180,180 80,420 240,560 C 340,650 200,780 140,840"
              stroke="url(#ribbonCyanGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ribbonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B98CFF" stopOpacity="0" />
                <stop offset="35%" stopColor="#B98CFF" stopOpacity="0.22" />
                <stop offset="70%" stopColor="#79D9FF" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#79D9FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="splash-ribbon-svg splash-ribbon-right" viewBox="0 0 600 800" fill="none">
            <path
              d="M 550,-30 C 420,200 540,380 360,540 C 240,650 440,760 500,850"
              stroke="url(#ribbonPinkGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ribbonPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#79D9FF" stopOpacity="0" />
                <stop offset="35%" stopColor="#79D9FF" stopOpacity="0.2" />
                <stop offset="75%" stopColor="#B98CFF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#B98CFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Layer 6: Glass-Light Orbs (Translucent with delicate specular rims) */}
        <div className="splash-glass-orbs-container">
          <div className="splash-glass-orb splash-glass-orb-1" />
          <div className="splash-glass-orb splash-glass-orb-2" />
          <div className="splash-glass-orb splash-glass-orb-3" />
        </div>

        {/* Layer 7: Minimal Floating Ambient Micro-Particles (8 particles) */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="splash-ambient-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}

        {/* Optical Glass Ambient Refraction Wave */}
        <div className="splash-ambient-glass-wave" />
      </div>

      {/* Top spacing to maintain vertical flex balance */}
      <div style={{ width: '100%', height: '36px' }} />

      {/* Center Hero Stage (Soul Sync Branding & Fluid Motion) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        {/* Layer 8 & Logo: Center Connection Glow behind Soul Sync Logo */}
        <div className="splash-logo-wrapper">
          <div className="splash-center-connection-glow" />
          <div className="splash-logo-halo" />
          <SoulEmblem size={92} variant="splash" />
        </div>

        {/* Brand Name: Soul Sync */}
        <h1
          className="splash-title-reveal"
          style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '0.85rem',
            color: '#F5F3F7',
            textShadow: '0 0 35px rgba(245, 243, 247, 0.22)'
          }}
        >
          Soul Sync
        </h1>

        {/* Main Tagline */}
        <p
          className="splash-tagline-reveal"
          style={{
            fontSize: '1.15rem',
            fontWeight: 500,
            color: '#F5F3F7',
            lineHeight: 1.6,
            maxWidth: '420px',
            marginBottom: '0.45rem'
          }}
        >
          Real People. Deeper Connections.
        </p>

        {/* Supporting Tagline */}
        <p
          className="splash-subline-reveal"
          style={{
            fontSize: '0.96rem',
            color: '#79D9FF',
            fontStyle: 'italic',
            marginBottom: '2.5rem',
            opacity: 0.95
          }}
        >
          Not just a social app, it's a feeling.
        </p>

        {/* Primary Action: ENTER SOUL SYNC */}
        <div className="splash-btn-wrap">
          <button
            className={`splash-enter-btn ${btnPressed ? 'btn-pressed' : ''}`}
            onClick={handleEnterSoulSync}
            style={{
              width: '250px',
              height: '50px',
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem'
            }}
            title="Enter Soul Sync"
          >
            <span style={{ position: 'relative', zIndex: 2, fontWeight: 700, letterSpacing: '0.04em' }}>
              ENTER SOUL SYNC
            </span>
            <ArrowRight size={17} style={{ position: 'relative', zIndex: 2 }} />

            {/* Subtle Glass Surface Light Sweep */}
            <div className="splash-btn-glass-sweep" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom Synchronicity Indicator */}
      <div className="splash-dots-reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '28px', height: '6px', borderRadius: '9999px', background: '#B98CFF', boxShadow: '0 0 10px rgba(185, 140, 255, 0.55)' }} />
        <div style={{ width: '8px', height: '6px', borderRadius: '9999px', background: 'rgba(245, 243, 247, 0.25)' }} />
        <div style={{ width: '8px', height: '6px', borderRadius: '9999px', background: 'rgba(245, 243, 247, 0.25)' }} />
      </div>
    </div>
  );
};

export default SplashScreen;
