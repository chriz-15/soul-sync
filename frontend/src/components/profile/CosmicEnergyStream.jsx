import React, { useEffect, useRef, useState } from 'react';

/**
 * CosmicEnergyStream - Thin luminous energy stream that curves gracefully across
 * the profile area from the coalescing sparkles into the Edit Profile button.
 */
const CosmicEnergyStream = ({ start, end, onComplete }) => {
  const hiddenPathRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [headPos, setHeadPos] = useState({ x: start.x, y: start.y });
  const [pathLength, setPathLength] = useState(600);

  // Smooth curved cubic-bezier path across the profile area
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const cp1x = start.x + dx * 0.28;
  const cp1y = start.y + 140;
  const cp2x = end.x + 85;
  const cp2y = end.y + 95;
  const pathD = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

  useEffect(() => {
    const pathEl = hiddenPathRef.current;
    if (!pathEl) return;
    const len = pathEl.getTotalLength();
    setPathLength(len);

    let animId;
    const duration = 540; // ~540ms curved transit
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Smooth custom cubic easing
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(ease);

      const currentLen = ease * len;
      const pt = pathEl.getPointAtLength(currentLen);
      setHeadPos({ x: pt.x, y: pt.y });

      if (t < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [start.x, start.y, end.x, end.y, onComplete]);

  // The stream has a dynamic comet trail (beam length)
  const beamLength = Math.min(110, pathLength * 0.35);
  const strokeOffset = pathLength * (1 - progress);

  return (
    <svg
      className="cosmic-energy-stream-canvas"
      aria-hidden="true"
    >
      <defs>
        {/* Multi-frequency iridescent gradient */}
        <linearGradient id="cosmicStreamGrad" gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
          <stop offset="0%" stopColor="#B98CFF" stopOpacity="0.3" />
          <stop offset="35%" stopColor="#B83268" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#F5F3F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#B98CFF" stopOpacity="1" />
        </linearGradient>

        {/* Soft specular glow filter */}
        <filter id="streamGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hidden reference path to compute getPointAtLength */}
      <path ref={hiddenPathRef} d={pathD} fill="none" stroke="none" />

      {/* 1. Outer Diffuse Glow Stream Layer */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(185, 140, 255, 0.35)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${beamLength * 1.2} ${pathLength}`}
        strokeDashoffset={strokeOffset}
        filter="url(#streamGlowFilter)"
      />

      {/* 2. Vibrant Violet-Cyan Neon Stream Layer */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#cosmicStreamGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray={`${beamLength} ${pathLength}`}
        strokeDashoffset={strokeOffset}
      />

      {/* 3. Ultra-Thin Pure White Energy Filament Core */}
      <path
        d={pathD}
        fill="none"
        stroke="#F5F3F7"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray={`${beamLength * 0.75} ${pathLength}`}
        strokeDashoffset={strokeOffset}
      />

      {/* 4. Leading Comet Head Sparkle Particle Cluster */}
      {progress > 0 && progress < 1 && (
        <g transform={`translate(${headPos.x}, ${headPos.y})`} className="energy-stream-comet-head">
          {/* Radial Aura */}
          <circle r="7" fill="url(#cosmicStreamGrad)" opacity="0.6" />
          <circle r="3.5" fill="#F5F3F7" />

          {/* 4-Point Star Core */}
          <path
            d="M 0 -8 L 2.2 -2.2 L 8 0 L 2.2 2.2 L 0 8 L -2.2 2.2 L -8 0 L -2.2 -2.2 Z"
            fill="#F5F3F7"
            transform={`rotate(${progress * 360})`}
          />

          {/* Small trailing micro-sparkles */}
          <circle cx="-10" cy="5" r="1.5" fill="#B98CFF" opacity="0.8" />
          <circle cx="-16" cy="11" r="1" fill="#B83268" opacity="0.6" />
        </g>
      )}
    </svg>
  );
};

export default CosmicEnergyStream;
