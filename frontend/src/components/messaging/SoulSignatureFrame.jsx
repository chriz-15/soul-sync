import React, { useState, useRef, useEffect } from 'react';
import { Music, Plus } from 'lucide-react';
import { SIGNATURE_TEMPLATES, ORGANIC_SHAPES } from './soulSignatureData';
import { playDoubleTapPing } from './soulAudioEngine';

/**
 * SoulSignatureFrame — Individual Organic Liquid Glass Signature
 * Visual composition modeled with fidelity to PRIMARY REFERENCE 1:
 * - Asymmetrical, flowing organic liquid-glass wave silhouette (strictly NOT a circle)
 * - Soaring wave crest at top-right, deep valley dip at top-left
 * - Double-walled translucent glass envelope with luminous cyan/violet refraction
 * - 4-pointed diamond star sparkle jewels & ethereal soul filaments
 * - Integrated portrait seamlessly vignetted into the cosmic depth
 * - Tiny floating Music badge in the upper right wave contour
 * - Compact square-ish thought capsule Note nestled in lower contour
 * - Double-tap: Universal Soul Resonance glowing blue heart bloom with smooth exit dissolve
 */
const SoulSignatureFrame = ({
  signature,
  isPlayingThisSong = false,
  onOpenMusic,
  onOpenNote,
  onReaction
}) => {
  const {
    id,
    name,
    avatar,
    isSelf,
    shapeIndex = 0,
    note,
    music
  } = signature;

  const template = SIGNATURE_TEMPLATES[shapeIndex % SIGNATURE_TEMPLATES.length] || SIGNATURE_TEMPLATES[0];
  const clipId = `soul-clip-${id}`;
  const rimGradId = `soul-rim-grad-${id}`;
  const innerGlassGradId = `soul-inner-glass-grad-${id}`;
  const vignetteGradId = `soul-vignette-grad-${id}`;
  const sheenGradId = `soul-sheen-grad-${id}`;
  const pulseGradId = `soul-pulse-grad-${id}`;
  const sparkleGlowId = `soul-sparkle-glow-${id}`;

  // Double-tap & single-tap gesture coordination
  const [bloomActive, setBloomActive] = useState(false);
  const [pulseGlow, setPulseGlow] = useState(false);
  const lastTapTimeRef = useRef(0);
  const singleTapTimerRef = useRef(null);
  const lastBloomTimeRef = useRef(0);
  const musicBtnRef = useRef(null);

  // Clean up any pending single-tap timers on unmount
  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
    };
  }, []);

  /**
   * triggerHeartBloom — The Universal Soul Resonance Double-Tap Effect
   * Immediately aborts any pending single-tap action (preventing accidental Note or Music panel opens)
   * and plays the 528Hz crystal resonance chime while blooming a glowing liquid blue heart.
   */
  const triggerHeartBloom = (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }

    // 1. CRITICAL: Cancel any pending single-tap action IMMEDIATELY
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    lastTapTimeRef.current = 0;

    // Prevent duplicate triggers in rapid succession (< 400ms)
    const now = Date.now();
    if (now - lastBloomTimeRef.current < 400) {
      return;
    }
    lastBloomTimeRef.current = now;

    // 2. Play 528Hz crystal resonance chime
    playDoubleTapPing();

    // 3. Trigger pulse glow and heart bloom
    setPulseGlow(true);
    setBloomActive(true);

    if (onReaction) {
      onReaction(id, '💙');
    }

    // 4. Smooth decay sequence
    setTimeout(() => {
      setPulseGlow(false);
    }, 450);

    // Heart dissolves completely by 880ms; unmount at 1050ms when fully invisible
    setTimeout(() => {
      setBloomActive(false);
    }, 1050);
  };

  /**
   * Frame Tap Handler:
   * - Double-tap on profile / frame area -> Triggers Blue Heart Bloom.
   * - Single-tap on profile / frame area -> Does NOT open Note panel. Does NOT navigate.
   */
  const handleFrameClick = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    if (timeDiff > 0 && timeDiff < 280) {
      // Confirmed double-tap on frame!
      triggerHeartBloom(e);
    } else {
      // First tap on frame: record timestamp, but DO NOT open Note
      lastTapTimeRef.current = now;
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
    }
  };

  /**
   * Note Tap Handler:
   * - Single-tap on Note -> Opens Note Customization Modal.
   * - Double-tap on Note -> CANCELS Note modal opening and triggers Blue Heart Bloom.
   */
  const handleNoteClick = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    if (timeDiff > 0 && timeDiff < 280) {
      // Confirmed double-tap on Note!
      triggerHeartBloom(e);
    } else {
      // First tap on Note: schedule opening the Note customization panel
      lastTapTimeRef.current = now;
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        lastTapTimeRef.current = 0;
        if (onOpenNote) {
          onOpenNote(signature);
        }
      }, 250);
    }
  };

  /**
   * Music / Song Tap Handler:
   * - Single-tap on Music / Song -> Opens Music Customization Panel.
   * - Double-tap on Music / Song -> CANCELS Music panel opening and triggers Blue Heart Bloom.
   */
  const handleMusicClick = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    if (timeDiff > 0 && timeDiff < 280) {
      // Confirmed double-tap on Music!
      triggerHeartBloom(e);
    } else {
      // First tap on Music: schedule opening the Music panel
      lastTapTimeRef.current = now;
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
      const rect = musicBtnRef.current?.getBoundingClientRect();
      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        lastTapTimeRef.current = 0;
        if (onOpenMusic) {
          onOpenMusic(signature, rect);
        }
      }, 250);
    }
  };

  const handleDoubleClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    triggerHeartBloom(e);
  };

  // Determine whether to show the Note on the lower side:
  // - Show if user has a note
  // - For self ('Your Soul'), if no note, show subtle '+ Note' prompt
  // - For other users, if no note, DO NOT show an empty placeholder
  const shouldShowNote = Boolean(note) || isSelf;

  // Determine whether to show the Music icon on the upper side:
  // - Show if user has music
  // - For self ('Your Soul'), show music icon (or add music if empty)
  // - For other users, if no music, DO NOT show music icon
  const shouldShowMusic = Boolean(music) || isSelf;

  return (
    <div
      className={`soul-signature-item ${isSelf ? 'is-self' : ''}`}
      id={`soul-sig-${id}`}
    >
      {/* COMPOSITION WRAPPER: Center Profile + Organic Frame + Upper Music + Lower Attached Note */}
      <div
        className={`soul-sig-frame-wrapper ${pulseGlow ? 'frame-pulsing' : ''}`}
        onClick={handleFrameClick}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`${name}'s Soul Signature Frame. Double tap to send heart resonance.`}
      >
        {/* SVG Organic Liquid Soul Signature Frame (Fidelity to Reference Image 1) */}
        <svg
          viewBox="0 0 120 120"
          className="soul-sig-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id={clipId}>
              <circle
                cx={template.avatarCenter.cx}
                cy={template.avatarCenter.cy}
                r={template.avatarCenter.r}
              />
            </clipPath>

            {/* Radiant Luminous Refraction Rim Gradient matching Reference 1 */}
            <linearGradient id={rimGradId} x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#F5F3F7" stopOpacity="0.98" />
              <stop offset="18%" stopColor="#B98CFF" stopOpacity="0.95" />
              <stop offset="46%" stopColor="#B83268" stopOpacity="0.92" />
              <stop offset="76%" stopColor="#B98CFF" stopOpacity="0.96" />
              <stop offset="100%" stopColor="rgba(15, 20, 38, 0.7)" stopOpacity="0.92" />
            </linearGradient>

            {/* Translucent Double-Walled Glass Body Gradient */}
            <linearGradient id={innerGlassGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(245, 243, 247, 0.28)" />
              <stop offset="30%" stopColor="rgba(185, 140, 255, 0.24)" />
              <stop offset="65%" stopColor="rgba(185, 140, 255, 0.22)" />
              <stop offset="100%" stopColor="rgba(15, 20, 38, 0.16)" />
            </linearGradient>

            {/* Atmospheric Vignette: seamlessly melts portrait into the cosmic frame */}
            <radialGradient id={vignetteGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(10, 14, 28, 0)" />
              <stop offset="66%" stopColor="rgba(10, 14, 28, 0)" />
              <stop offset="86%" stopColor="rgba(10, 14, 28, 0.55)" />
              <stop offset="100%" stopColor="rgba(10, 14, 28, 0.95)" />
            </radialGradient>

            {/* Liquid Surface Sheen */}
            <radialGradient id={sheenGradId} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F5F3F7" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#B98CFF" stopOpacity="0.12" />
              <stop offset="85%" stopColor="#0a0e2a" stopOpacity="0.45" />
            </radialGradient>

            {/* Double-tap pulse glow */}
            <radialGradient id={pulseGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B98CFF" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#ec4899" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#B83268" stopOpacity="0" />
            </radialGradient>

            {/* Sparkle Drop Shadow Glow */}
            <filter id={sparkleGlowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="#B98CFF" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="4.0" floodColor="#B83268" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Ambient outer luminous glow halo */}
          <path
            d={template.outerRibbon}
            fill="none"
            stroke={`url(#${rimGradId})`}
            strokeWidth="7"
            className="soul-sig-halo"
          />

          {/* 2. Ethereal branching soul filaments / tendrils (Reference 1) */}
          {template.tendrils.map((d, i) => (
            <path
              key={`tendril-${i}`}
              d={d}
              fill="none"
              stroke={i % 2 === 0 ? "rgba(185, 140, 255, 0.65)" : "rgba(184, 50, 104, 0.6)"}
              strokeWidth="0.9"
              strokeLinecap="round"
              className="soul-sig-tendril"
            />
          ))}

          {/* 3. Layered translucent liquid glass body (Double-walled ribbon effect) */}
          <path
            d={`${template.outerRibbon} ${template.innerRibbon}`}
            fill={`url(#${innerGlassGradId})`}
            fillRule="evenodd"
            className="soul-sig-glass-body"
          />

          {/* 4. Integrated portrait with vignette & sheen */}
          <g clipPath={`url(#${clipId})`}>
            <image
              href={avatar}
              x={template.avatarCenter.cx - template.avatarCenter.r}
              y={template.avatarCenter.cy - template.avatarCenter.r}
              width={template.avatarCenter.r * 2}
              height={template.avatarCenter.r * 2}
              preserveAspectRatio="xMidYMid slice"
              className="soul-sig-avatar-image"
            />
            {/* Atmospheric vignette that seamlessly merges image with frame */}
            <circle
              cx={template.avatarCenter.cx}
              cy={template.avatarCenter.cy}
              r={template.avatarCenter.r}
              fill={`url(#${vignetteGradId})`}
            />
            {/* Liquid surface glass sheen */}
            <circle
              cx={template.avatarCenter.cx}
              cy={template.avatarCenter.cy}
              r={template.avatarCenter.r}
              fill={`url(#${sheenGradId})`}
              opacity="0.32"
            />
          </g>

          {/* 5. Inner refractive edge contour */}
          <path
            d={template.innerRibbon}
            fill="none"
            stroke="rgba(245, 243, 247, 0.42)"
            strokeWidth="1.2"
            strokeDasharray="40 2"
            className="soul-sig-inner-rim"
          />

          {/* 6. Primary organic liquid refraction rim stroke (Outer Wave Ribbon) */}
          <path
            d={template.outerRibbon}
            fill="none"
            stroke={`url(#${rimGradId})`}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="soul-sig-rim-stroke"
          />

          {/* Internal emotional light pulse during double-tap */}
          {pulseGlow && (
            <path
              d={template.outerRibbon}
              fill={`url(#${pulseGradId})`}
              className="soul-sig-pulse-overlay"
            />
          )}

          {/* 7. Luminous 4-Pointed Diamond Star Sparkle Jewels (Reference Image 1) */}
          {template.sparkles.map((sp, idx) => {
            const s = sp.size;
            const h = s / 2;
            const q = s * 0.22;
            const starPath = `M ${sp.x},${sp.y - h} L ${sp.x + q},${sp.y - q} L ${sp.x + h},${sp.y} L ${sp.x + q},${sp.y + q} L ${sp.x},${sp.y + h} L ${sp.x - q},${sp.y + q} L ${sp.x - h},${sp.y} L ${sp.x - q},${sp.y - q} Z`;
            return (
              <g key={`sparkle-${idx}`} className="soul-star-sparkle-group">
                <path
                  d={starPath}
                  fill={sp.color}
                  filter={`url(#${sparkleGlowId})`}
                  className="soul-diamond-star"
                />
                <circle cx={sp.x} cy={sp.y} r={s * 0.2} fill={sp.core} />
              </g>
            );
          })}

          {/* 8. Micro stardust points */}
          <circle
            cx={template.crestPoint.x + 8}
            cy={template.crestPoint.y + 12}
            r="1.3"
            fill="#ffffff"
            className="soul-micro-stardust"
          />
          <circle
            cx={template.avatarCenter.cx - 28}
            cy={template.avatarCenter.cy + 26}
            r="1.1"
            fill="#B98CFF"
            className="soul-micro-stardust stardust-delayed"
          />
        </svg>

        {/* DOUBLE-TAP LUMINOUS BLUE HEART BLOOM OVERLAY */}
        {bloomActive && (
          <div className="soul-double-tap-heart-overlay" aria-hidden="true">
            <div className="soul-blue-resonance-ring" />
            <svg
              viewBox="0 0 24 24"
              className="soul-blue-heart-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`soul-blue-heart-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5F3F7" stopOpacity="0.95" />
                  <stop offset="28%" stopColor="#79D9FF" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#B98CFF" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="rgba(15, 20, 38, 0.7)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={`url(#soul-blue-heart-grad-${id})`}
              />
            </svg>
          </div>
        )}

        {/* 4. UPPER SIDE: MUSIC ICON (EMPTY-STATE) OR LIQUID GLASS SONG DISPLAY */}
        {music ? (
          /* STATE B: SONG SELECTED (For both Your Soul & Other Users) */
          <button
            ref={musicBtnRef}
            type="button"
            className={`soul-sig-song-display ${isPlayingThisSong ? 'is-playing' : ''}`}
            onClick={handleMusicClick}
            onDoubleClick={handleDoubleClick}
            aria-label={
              isSelf
                ? `Current soundtrack: ${music.title}. Tap to change or remove.`
                : `Listen to ${music.title} by ${music.artist}`
            }
            title={
              isSelf
                ? `♪ ${music.title} — ${music.artist} (Tap to change or remove)`
                : `♪ ${music.title} — ${music.artist} (${music.lang})`
            }
          >
            {isPlayingThisSong ? (
              <span className="soul-sig-soundbars">
                <span className="soul-bar bar-1" />
                <span className="soul-bar bar-2" />
                <span className="soul-bar bar-3" />
              </span>
            ) : (
              <Music size={9} className="soul-song-tag-icon" />
            )}
            <span className="soul-sig-song-title">{music.title}</span>
          </button>
        ) : isSelf ? (
          /* STATE A: NO SONG & YOUR SOUL (Owner-only Add-Music control) */
          <button
            ref={musicBtnRef}
            type="button"
            className={`soul-sig-music-btn ${isPlayingThisSong ? 'is-playing' : ''}`}
            onClick={handleMusicClick}
            onDoubleClick={handleDoubleClick}
            aria-label="Customize Soundtrack"
            title="Add a Soul Soundtrack"
          >
            <Music size={10} className="soul-music-note-icon" />
          </button>
        ) : null /* Other users with NO song: DO NOT show music icon */}

        {/* 5. LOWER SIDE: COMPACT NOTE (OFFSET FROM CENTER WITH DELIBERATE BREATHING GAP) */}
        {shouldShowNote && (
          <div
            className={`soul-sig-attached-note ${isSelf ? 'is-self-note' : 'is-other-note'} ${isSelf && !note ? 'is-empty' : ''}`}
            onClick={handleNoteClick}
            onDoubleClick={handleDoubleClick}
            title={note ? `${name}: "${note}"` : 'Share a Soul Note'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNoteClick(e)}
          >
            <div className="soul-sig-attached-bubble">
              {note ? (
                <span className="soul-sig-note-text">{note}</span>
              ) : isSelf ? (
                <span className="soul-sig-note-text add-note">
                  <Plus size={10} className="add-note-icon" /> Note
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* 6. USER NAME UNDERNEATH (ONLY FOR 'YOUR SOUL') */}
      {isSelf && (
        <span
          className="soul-sig-name"
          onClick={handleNoteClick}
          onDoubleClick={handleDoubleClick}
        >
          {name}
        </span>
      )}
    </div>
  );
};

export default SoulSignatureFrame;
