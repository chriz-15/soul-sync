import React, { useEffect, useRef, useState } from 'react';

/**
 * CoverEnergyStream - Organic curved liquid energy particle flow
 * flowing from the dissolving Edit Cover state into the Edit Cover button.
 * Uses Soul Sync's cyan / violet / pink signature language with micro-particles.
 */
const CoverEnergyStream = ({ start, end, onComplete }) => {
  const hiddenPathRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [headPos, setHeadPos] = useState({ x: start.x, y: start.y });
  const [pathLength, setPathLength] = useState(500);

  // Organic curved trajectory arcing upward and rightward toward Edit Cover button
  const dx = end.x - start.x;
  const cp1x = start.x + dx * 0.22 - 35;
  const cp1y = start.y - 130;
  const cp2x = end.x - 70;
  const cp2y = end.y + 60;
  const pathD = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

  useEffect(() => {
    const pathEl = hiddenPathRef.current;
    if (!pathEl) return;
    const len = pathEl.getTotalLength();
    setPathLength(len);

    let animId;
    const duration = 480; // ~480ms fluid transit
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Smooth custom organic cubic easing
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

  // Dynamic beam length with narrowing taper near destination
  const beamLength = Math.min(95, pathLength * 0.32) * (1 - progress * 0.25);
  const strokeOffset = pathLength * (1 - progress);

  // Micro-particles trailing along the stream with organic dispersion
  const trailOffsets = [0.06, 0.12, 0.18, 0.24, 0.30];
  const trailParticles = trailOffsets.map((off, idx) => {
    const pLen = Math.max(0, (progress - off) * pathLength);
    let pos = { x: start.x, y: start.y };
    if (hiddenPathRef.current && pLen > 0) {
      pos = hiddenPathRef.current.getPointAtLength(pLen);
    }
    const colors = ['#B98CFF', '#B83268', '#F5F3F7', '#B83268', '#B98CFF'];
    const radialDispersion = ((idx % 2 === 0 ? 1 : -1) * (2 + (idx % 3) * 1.5));
    return {
      id: idx,
      x: pos.x + radialDispersion,
      y: pos.y + (radialDispersion * 0.6),
      color: colors[idx % colors.length],
      size: Math.max(1.5, 3.5 - idx * 0.5),
      opacity: Math.max(0, (1 - off * 2.8)) * (progress > off ? 1 : 0)
    };
  });

  return (
    <svg className="cosmic-energy-stream-canvas" aria-hidden="true">
      <defs>
        {/* Multi-tone signature liquid gradient: Cyan -> Violet -> Pink -> White */}
        <linearGradient id="coverEnergyGrad" gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
          <stop offset="0%" stopColor="#B98CFF" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#B83268" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#B83268" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5F3F7" stopOpacity="1" />
        </linearGradient>

        {/* Soft specular glow filter */}
        <filter id="coverGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hidden reference path */}
      <path ref={hiddenPathRef} d={pathD} fill="none" stroke="none" />

      {/* 1. Outer Soft Luminous Aura */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(185, 140, 255, 0.35)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeDasharray={`${beamLength * 1.15} ${pathLength}`}
        strokeDashoffset={strokeOffset}
        filter="url(#coverGlowFilter)"
      />

      {/* 2. Vibrant Cyan-Violet-Pink Liquid Core */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#coverEnergyGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray={`${beamLength} ${pathLength}`}
        strokeDashoffset={strokeOffset}
      />

      {/* 3. Ultra-Thin Pure White Energy Filament Core */}
      <path
        d={pathD}
        fill="none"
        stroke="#F5F3F7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray={`${beamLength * 0.7} ${pathLength}`}
        strokeDashoffset={strokeOffset}
      />

      {/* 4. Trailing Liquid Micro-Particles */}
      {trailParticles.map((tp) => (
        tp.opacity > 0 && (
          <circle
            key={tp.id}
            cx={tp.x}
            cy={tp.y}
            r={tp.size}
            fill={tp.color}
            opacity={tp.opacity * 0.85}
            filter="drop-shadow(0 0 2px rgba(185, 140, 255, 0.6))"
          />
        )
      ))}

      {/* 5. Leading Comet Head Sparkle Particle */}
      {progress > 0 && progress < 1 && (
        <g transform={`translate(${headPos.x}, ${headPos.y})`} className="energy-stream-comet-head">
          <circle r="6" fill="url(#coverEnergyGrad)" opacity="0.6" />
          <circle r="3" fill="#F5F3F7" />
          {/* Rotating 4-Point Star */}
          <path
            d="M 0 -7 L 1.8 -1.8 L 7 0 L 1.8 1.8 L 0 7 L -1.8 1.8 L -7 0 L -1.8 -1.8 Z"
            fill="#F5F3F7"
            transform={`rotate(${progress * 420})`}
          />
          {/* Micro-sparkles */}
          <circle cx="-7" cy="4" r="1.4" fill="#B98CFF" opacity="0.8" />
          <circle cx="-13" cy="8" r="1" fill="#B83268" opacity="0.65" />
        </g>
      )}
    </svg>
  );
};

export default CoverEnergyStream;
