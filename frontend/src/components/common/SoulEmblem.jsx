import React, { useId } from 'react';

/**
 * SoulEmblem — Official Soul Sync Logo
 * 
 * Theme: Midnight Navy × Deep Rose × Subtle Ice × Lavender Glow
 * 
 * Composition:
 * 1. Two overlapping liquid-glass chat bubbles:
 *    - Upper-Left: Subtle Ice & Lavender liquid glass with friendly expression
 *    - Lower-Right: Deep Rose & Soft Peach liquid glass with friendly expression
 * 2. Luminous 3D glowing orbital ring passing behind and around the bubbles
 * 3. Sparse, balanced floating light particles/dots around the orbital perimeter
 * 4. Premium dimensional liquid-glass material (soft internal refraction, specular rim, curved surface sheen)
 */
const SoulEmblem = ({ size = 48, className = '', variant = 'default' }) => {
  const instanceId = useId().replace(/:/g, '_');

  // Unique IDs for gradients and filters
  const b1GradId = `b1Grad_${instanceId}`;
  const b1InnerCoreId = `b1Core_${instanceId}`;
  const b2GradId = `b2Grad_${instanceId}`;
  const b2InnerCoreId = `b2Core_${instanceId}`;
  const b1RimId = `b1Rim_${instanceId}`;
  const b2RimId = `b2Rim_${instanceId}`;
  const sheenId = `sheen_${instanceId}`;
  const orbitGradId = `orbitGrad_${instanceId}`;
  const orbitGlowId = `orbitGlow_${instanceId}`;
  const bubbleShadowId = `bShadow_${instanceId}`;
  const appIconBorderGradId = `appIconBorderGrad_${instanceId}`;
  const appIconGlowId = `appIconGlow_${instanceId}`;

  // Palette: Midnight Navy (#080D1C), Deep Rose (#B83268), Subtle Ice (#79D9FF), Lavender Glow (#B98CFF)
  // Upper-Left Bubble: Subtle Ice -> Lavender Glow
  const b1Colors = {
    start: '#79D9FF',
    mid: '#8FA6E8',
    end: '#101833',
    core: '#C8E8FF',
    rimStart: '#F5F3F7',
    rimEnd: '#79D9FF',
    blush: '#B98CFF'
  };

  // Lower-Right Bubble: Deep Rose -> Lavender Glow / Peach
  const b2Colors = {
    start: '#D4427E',
    mid: '#B83268',
    end: '#6B193C',
    core: '#F5A3C4',
    rimStart: '#F5F3F7',
    rimEnd: '#B83268',
    blush: '#B98CFF'
  };

  const eyeColor = '#080D1C';
  const creamLight = '#F5F3F7';
  const roseLight = '#B83268';
  const iceLight = '#79D9FF';
  const lavenderLight = '#B98CFF';

  const dropShadowFilter = size <= 24
    ? 'drop-shadow(0 1px 4px rgba(184, 50, 104, 0.35))'
    : 'drop-shadow(0 4px 18px rgba(184, 50, 104, 0.32)) drop-shadow(0 2px 10px rgba(185, 140, 255, 0.28))';

  // Bubble 1: Upper-left rounded chat bubble with bottom-left speech tail
  const bubble1Path =
    'M 27 15 L 47 15 C 55 15 61 21 61 29 L 61 43 C 61 51 55 57 47 57 L 31 57 C 25 63 19 68 14 69 C 18 64 20 59 20 55 C 15 53 13 48 13 43 L 13 29 C 13 21 19 15 27 15 Z';

  // Bubble 2: Lower-right rounded chat bubble with bottom-right speech tail
  const bubble2Path =
    'M 53 39 L 73 39 C 81 39 87 45 87 53 L 87 67 C 87 73 85 78 80 80 C 80 84 82 88 86 93 C 81 91 75 86 69 81 L 53 81 C 45 81 39 75 39 67 L 39 53 C 39 45 45 39 53 39 Z';

  return (
    <div
      className={`soul-emblem-container ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
      aria-label="Soul Sync Logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="-6 -6 112 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: dropShadowFilter,
          overflow: 'visible'
        }}
      >
        <style>
          {`
            @keyframes seFloat_${instanceId} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1.2px); }
            }
            @keyframes seOrbitGlow_${instanceId} {
              0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px rgba(185, 140, 255, 0.45)); }
              50% { opacity: 1; filter: drop-shadow(0 0 7px rgba(184, 50, 104, 0.65)); }
            }
            @keyframes seTwinkleA_${instanceId} {
              0%, 100% { opacity: 0.65; transform: scale(0.9); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            @keyframes seTwinkleB_${instanceId} {
              0%, 100% { opacity: 0.85; transform: scale(1.15); }
              50% { opacity: 0.5; transform: scale(0.85); }
            }
            .se-floating-body_${instanceId} {
              animation: seFloat_${instanceId} 6.5s ease-in-out infinite;
              transform-origin: 50% 50%;
            }
            .se-orbit-ring_${instanceId} {
              animation: seOrbitGlow_${instanceId} 5s ease-in-out infinite;
            }
            .se-particle-a_${instanceId} {
              animation: seTwinkleA_${instanceId} 3.8s ease-in-out infinite;
              transform-origin: center;
            }
            .se-particle-b_${instanceId} {
              animation: seTwinkleB_${instanceId} 4.4s ease-in-out infinite;
              transform-origin: center;
            }
          `}
        </style>

        <defs>
          {/* ====================================================
              GRADIENTS FOR LIQUID GLASS CHAT BUBBLES
              ==================================================== */}
          {/* Bubble 1 (Subtle Ice / Lavender) Glass Fill */}
          <linearGradient id={b1GradId} x1="15%" y1="12%" x2="85%" y2="88%">
            <stop offset="0%" stopColor={b1Colors.start} stopOpacity="0.96" />
            <stop offset="48%" stopColor={b1Colors.mid} stopOpacity="0.92" />
            <stop offset="100%" stopColor={b1Colors.end} stopOpacity="0.96" />
          </linearGradient>

          {/* Bubble 1 Volumetric Internal Refraction Glow */}
          <radialGradient id={b1InnerCoreId} cx="36%" cy="32%" r="58%">
            <stop offset="0%" stopColor={b1Colors.core} stopOpacity="0.65" />
            <stop offset="45%" stopColor={b1Colors.start} stopOpacity="0.25" />
            <stop offset="100%" stopColor={b1Colors.end} stopOpacity="0" />
          </radialGradient>

          {/* Bubble 2 (Deep Rose / Peach) Glass Fill */}
          <linearGradient id={b2GradId} x1="15%" y1="12%" x2="85%" y2="88%">
            <stop offset="0%" stopColor={b2Colors.start} stopOpacity="0.96" />
            <stop offset="48%" stopColor={b2Colors.mid} stopOpacity="0.94" />
            <stop offset="100%" stopColor={b2Colors.end} stopOpacity="0.96" />
          </linearGradient>

          {/* Bubble 2 Volumetric Internal Refraction Glow */}
          <radialGradient id={b2InnerCoreId} cx="36%" cy="32%" r="58%">
            <stop offset="0%" stopColor={b2Colors.core} stopOpacity="0.7" />
            <stop offset="45%" stopColor={b2Colors.start} stopOpacity="0.3" />
            <stop offset="100%" stopColor={b2Colors.end} stopOpacity="0" />
          </radialGradient>

          {/* Bubble 1 Specular Rim Stroke */}
          <linearGradient id={b1RimId} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor={b1Colors.rimStart} stopOpacity="0.9" />
            <stop offset="35%" stopColor={b1Colors.rimStart} stopOpacity="0.45" />
            <stop offset="70%" stopColor={b1Colors.rimEnd} stopOpacity="0.25" />
            <stop offset="100%" stopColor={b1Colors.rimEnd} stopOpacity="0.5" />
          </linearGradient>

          {/* Bubble 2 Specular Rim Stroke */}
          <linearGradient id={b2RimId} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor={b2Colors.rimStart} stopOpacity="0.95" />
            <stop offset="35%" stopColor={b2Colors.rimStart} stopOpacity="0.5" />
            <stop offset="70%" stopColor={b2Colors.rimEnd} stopOpacity="0.3" />
            <stop offset="100%" stopColor={b2Colors.rimEnd} stopOpacity="0.55" />
          </linearGradient>

          {/* Top Surface Curved Glass Glint / Sheen */}
          <linearGradient id={sheenId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={creamLight} stopOpacity="0.8" />
            <stop offset="65%" stopColor={creamLight} stopOpacity="0.2" />
            <stop offset="100%" stopColor={creamLight} stopOpacity="0" />
          </linearGradient>

          {/* Luminous Orbital Ring Gradient */}
          <linearGradient id={orbitGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={creamLight} stopOpacity="0.95" />
            <stop offset="25%" stopColor={roseLight} stopOpacity="0.9" />
            <stop offset="55%" stopColor={lavenderLight} stopOpacity="0.85" />
            <stop offset="80%" stopColor={iceLight} stopOpacity="0.85" />
            <stop offset="100%" stopColor={creamLight} stopOpacity="0.9" />
          </linearGradient>

          {/* Soft Bloom Filter for Ring Halo */}
          <filter id={orbitGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Contact Drop-Shadow of Bubble 2 onto Bubble 1 */}
          <filter id={bubbleShadowId} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="-2" dy="2" stdDeviation="3.2" floodColor="#000000" floodOpacity="0.35" />
          </filter>

          {/* ====================================================
              APP ICON FRAME: SUBTLE BLUE-TO-PINK/PURPLE BORDER
              ==================================================== */}
          <linearGradient id={appIconBorderGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#79D9FF" stopOpacity="0.85" />
            <stop offset="48%" stopColor="#B98CFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#D4427E" stopOpacity="0.85" />
          </linearGradient>

          {/* Soft Glow Filter for App Icon Border */}
          <filter id={appIconGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ====================================================
            APP ICON FRAME: CLEAN, PREMIUM ROUNDED-SQUARE BORDER
            ==================================================== */}
        <g className="app-icon-border-frame">
          {/* Subtle Blue-to-Pink/Purple Gradient Glow */}
          <rect
            x="-4"
            y="-4"
            width="108"
            height="108"
            rx="24"
            ry="24"
            fill="none"
            stroke={`url(#${appIconBorderGradId})`}
            strokeWidth="2.4"
            opacity="0.3"
            filter={`url(#${appIconGlowId})`}
          />
          {/* Thin, Elegant, Refined App Icon Border */}
          <rect
            x="-4"
            y="-4"
            width="108"
            height="108"
            rx="24"
            ry="24"
            fill="none"
            stroke={`url(#${appIconBorderGradId})`}
            strokeWidth="1.25"
            opacity="0.9"
          />
        </g>

        {/* LAYER 1: FLOATING LIGHT PARTICLES */}
        <g className="logo-floating-particles">
          <circle cx="17" cy="22" r="1.5" fill={creamLight} className={`se-particle-a_${instanceId}`} opacity="0.85" />
          <circle cx="40" cy="10" r="1.3" fill={lavenderLight} className={`se-particle-b_${instanceId}`} opacity="0.75" />
          <circle cx="74" cy="15" r="1.8" fill={roseLight} className={`se-particle-a_${instanceId}`} opacity="0.85" />
          <circle cx="90" cy="28" r="1.4" fill={iceLight} className={`se-particle-b_${instanceId}`} opacity="0.9" />
          <circle cx="11" cy="61" r="1.9" fill={iceLight} className={`se-particle-a_${instanceId}`} opacity="0.8" />
          <circle cx="85" cy="74" r="1.6" fill={lavenderLight} className={`se-particle-b_${instanceId}`} opacity="0.85" />
          <circle cx="29" cy="79" r="1.3" fill={creamLight} className={`se-particle-a_${instanceId}`} opacity="0.7" />
        </g>

        {/* LAYER 2: GLOWING ORBITAL RING — REAR ARC */}
        <g transform="rotate(-26 50 50)" className={`se-orbit-ring_${instanceId}`}>
          <path
            d="M 8 50 A 42 17 0 0 1 92 50"
            fill="none"
            stroke={`url(#${orbitGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.32"
            filter={`url(#${orbitGlowId})`}
          />
          <path
            d="M 8 50 A 42 17 0 0 1 92 50"
            fill="none"
            stroke={`url(#${orbitGradId})`}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* MAIN BODY GROUP: FLOATING LIQUID GLASS CHAT BUBBLES */}
        <g className={`se-floating-body_${instanceId}`}>
          {/* LAYER 3: BUBBLE 1 (UPPER-LEFT: SUBTLE ICE / LAVENDER GLASS) */}
          <g className="logo-bubble-back">
            <path d={bubble1Path} fill={`url(#${b1GradId})`} />
            <path d={bubble1Path} fill={`url(#${b1InnerCoreId})`} />
            <path d={bubble1Path} fill="none" stroke={`url(#${b1RimId})`} strokeWidth="1.3" />
            <path
              d="M 27 18 L 47 18 C 52 18 56 20 57 24 C 48 21.5 31 22 20.5 27 C 21.5 21 24 18 27 18 Z"
              fill={`url(#${sheenId})`}
              opacity="0.85"
            />
            <ellipse cx="28" cy="53" rx="7" ry="1.5" fill={b1Colors.rimStart} opacity="0.25" />
            <ellipse cx="25.5" cy="37" rx="2.5" ry="1.5" fill={b1Colors.blush} opacity="0.36" />
            <ellipse cx="47.5" cy="37" rx="2.5" ry="1.5" fill={b1Colors.blush} opacity="0.36" />
            <circle cx="29" cy="33" r="2.3" fill={eyeColor} />
            <circle cx="29.8" cy="32.2" r="0.75" fill="#FFFFFF" />
            <circle cx="44" cy="33" r="2.3" fill={eyeColor} />
            <circle cx="44.8" cy="32.2" r="0.75" fill="#FFFFFF" />
            <path
              d="M 33 39.5 Q 36.5 43.5 40 39.5"
              fill="none"
              stroke={eyeColor}
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </g>

          {/* LAYER 4: BUBBLE 2 (LOWER-RIGHT: DEEP ROSE / PEACH GLASS) */}
          <g className="logo-bubble-front" filter={`url(#${bubbleShadowId})`}>
            <path d={bubble2Path} fill={`url(#${b2GradId})`} />
            <path d={bubble2Path} fill={`url(#${b2InnerCoreId})`} />
            <path d={bubble2Path} fill="none" stroke={`url(#${b2RimId})`} strokeWidth="1.3" />
            <path
              d="M 53 42 L 73 42 C 78 42 82 44 83 48 C 74 45.5 57 46 46.5 51 C 47.5 45 50 42 53 42 Z"
              fill={`url(#${sheenId})`}
              opacity="0.9"
            />
            <ellipse cx="56" cy="77" rx="7" ry="1.5" fill={b2Colors.rimStart} opacity="0.25" />
            <ellipse cx="51.5" cy="61" rx="2.5" ry="1.5" fill={b2Colors.blush} opacity="0.45" />
            <ellipse cx="73.5" cy="61" rx="2.5" ry="1.5" fill={b2Colors.blush} opacity="0.45" />
            <circle cx="55" cy="57" r="2.3" fill={eyeColor} />
            <circle cx="55.8" cy="56.2" r="0.75" fill="#FFFFFF" />
            <circle cx="70" cy="57" r="2.3" fill={eyeColor} />
            <circle cx="70.8" cy="56.2" r="0.75" fill="#FFFFFF" />
            <path
              d="M 59 63.5 Q 62.5 67.5 66 63.5"
              fill="none"
              stroke={eyeColor}
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* LAYER 5: GLOWING ORBITAL RING — FRONT ARC */}
        <g transform="rotate(-26 50 50)" className={`se-orbit-ring_${instanceId}`}>
          <path
            d="M 92 50 A 42 17 0 0 1 8 50"
            fill="none"
            stroke={`url(#${orbitGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.42"
            filter={`url(#${orbitGlowId})`}
          />
          <path
            d="M 92 50 A 42 17 0 0 1 8 50"
            fill="none"
            stroke={`url(#${orbitGradId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.96"
          />
        </g>
      </svg>
    </div>
  );
};

export default SoulEmblem;
