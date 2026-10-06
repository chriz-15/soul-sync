import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Info,
  Mic,
  Paperclip,
  Smile,
  Send
} from 'lucide-react';

/**
 * ChatFlowTransition — Soul Sync Premium Chat Bloom-Out Transition
 *
 * Visual Sequence:
 * CHAT ITEM -> tap -> internal bloom -> new surface blooms outward toward foreground
 * -> chat conversation page emerges -> full conversation screen.
 *
 * The destination conversation page is a NEW SURFACE emerging from inside the tapped chat item,
 * while the underlying chat list stays completely intact and stationary.
 */

const SPARKLES = [
  { id: 'sp-1', angle: -0.55, dist: 38, size: 3.5, startT: 0.12, peakT: 0.34, endT: 0.62 },
  { id: 'sp-2', angle: 0.65, dist: 46, size: 4, startT: 0.15, peakT: 0.38, endT: 0.66 },
  { id: 'sp-3', angle: 2.25, dist: 34, size: 3, startT: 0.18, peakT: 0.42, endT: 0.70 },
  { id: 'sp-4', angle: 3.55, dist: 42, size: 3.5, startT: 0.22, peakT: 0.46, endT: 0.74 }
];

const ChatFlowTransition = ({
  originRect,
  targetRect,
  selectedConv,
  activeChatMessages = [],
  onComplete
}) => {
  const [normTime, setNormTime] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const duration = 520; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setNormTime(t);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [onComplete]);

  if (!originRect || !targetRect) return null;

  // Origin point relative to the destination surface
  const originRelX = originRect.centerX - targetRect.left;
  const originRelY = originRect.centerY - targetRect.top;

  // Maximum radius needed to fully cover all corners of the destination surface
  const maxDistance =
    Math.hypot(
      Math.max(originRelX, targetRect.width - originRelX),
      Math.max(originRelY, targetRect.height - originRelY)
    ) + 40;

  // Refined quintic ease-out for smooth acceleration and organic settling
  const ease = 1 - Math.pow(1 - normTime, 3.8);

  // Expanding bloom radius
  const currentRadius = Math.max(0, ease * maxDistance);

  // Subtle forward lift and depth scale (emerging toward user from the origin point)
  const currentScale = 0.94 + 0.06 * ease;
  const currentTranslateY = (1 - ease) * (originRelY - targetRect.height / 2) * 0.06;
  const currentTranslateX = (1 - ease) * (originRelX - targetRect.width / 2) * 0.04;

  // Messages to show inside the blooming surface
  const displayMessages =
    activeChatMessages && activeChatMessages.length > 0
      ? activeChatMessages
      : selectedConv?.last_message
      ? [
          {
            id: 'temp-preview',
            sender_id: selectedConv.id,
            text: selectedConv.last_message,
            created_at: selectedConv.last_message_time || '10:45'
          }
        ]
      : [];

  return (
    <div
      className="chat-bloom-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 220,
        overflow: 'hidden'
      }}
    >
      {/* 1. Subtle Ambient Depth Dimming (barely perceptible, zero heavy overlay) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 14, 28, 0.4)',
          opacity: Math.sin(normTime * Math.PI) * 0.35,
          pointerEvents: 'none',
          zIndex: 221
        }}
      />

      {/* 2. The New Conversation Page Surface Blooming Out From Inside the Chat */}
      <div
        className="chat-blooming-surface liquid-glass-panel"
        style={{
          position: 'fixed',
          top: `${targetRect.top}px`,
          left: `${targetRect.left}px`,
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`,
          borderRadius: '24px',
          background: 'rgba(15, 20, 38, 0.88)',
          border: '1px solid rgba(185, 140, 255, 0.18)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(185, 140, 255, 0.12)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 225,
          transformOrigin: `${originRelX}px ${originRelY}px`,
          transform: `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0) scale(${currentScale})`,
          clipPath: `circle(${currentRadius}px at ${originRelX}px ${originRelY}px)`,
          WebkitClipPath: `circle(${currentRadius}px at ${originRelX}px ${originRelY}px)`
        }}
      >
        {/* ===================================================
            CHAT HEADER (Revealed naturally from inside the bloom)
            =================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.1rem',
            borderBottom: `1px solid rgba(255, 255, 255, ${Math.max(0, (normTime - 0.4) / 0.6) * 0.1})`,
            flexShrink: 0
          }}
        >
          {/* Left: Back button + Avatar + Partner Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="btn-secondary-glass chat-back-btn" style={{ pointerEvents: 'none' }}>
              <ArrowLeft size={16} />
              <span>Messages</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={
                    selectedConv?.partner_avatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={selectedConv?.partner_name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid rgba(185, 140, 255, 0.55)',
                    boxShadow: '0 0 12px rgba(185, 140, 255, 0.3)'
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#79D9FF',
                    border: '2px solid var(--bg-cosmos)',
                    boxShadow: '0 0 6px rgba(121, 217, 255, 0.6)'
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#F5F3F7' }}>
                  {selectedConv?.partner_name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.74rem',
                    color: '#10b981'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#79D9FF' }} />
                  <span>Active Now • Soul Frequency 94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Phone, Video, Info control buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              className="btn-secondary-glass"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Phone size={16} />
            </div>
            <div
              className="btn-secondary-glass"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Video size={16} />
            </div>
            <div
              className="btn-secondary-glass"
              style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Info size={16} />
            </div>
          </div>
        </div>

        {/* ===================================================
            MESSAGE BUBBLE HISTORY (Revealed through the expanding bloom)
            =================================================== */}
        <div
          className="chat-messages-scroll"
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1rem 0',
            gap: '0.9rem'
          }}
        >
          {displayMessages.map((msg, idx) => {
            const isSelf = msg.sender_id === 1;
            return (
              <div
                key={msg.id || idx}
                className={`chat-bubble ${isSelf ? 'outgoing' : 'incoming'}`}
                style={{ pointerEvents: 'none' }}
              >
                {msg.media_url && (
                  <img
                    src={msg.media_url}
                    alt="Shared media"
                    style={{
                      width: '100%',
                      maxHeight: '260px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      marginBottom: msg.text ? '0.5rem' : 0
                    }}
                  />
                )}
                {msg.text && <div>{msg.text}</div>}
              </div>
            );
          })}
        </div>

        {/* ===================================================
            MESSAGE INPUT COMPOSER (Revealed at the bottom of the bloom)
            =================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            paddingTop: '0.85rem',
            borderTop: `1px solid rgba(255, 255, 255, ${Math.max(0, (normTime - 0.4) / 0.6) * 0.1})`,
            flexShrink: 0
          }}
        >
          <div
            className="btn-secondary-glass"
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Mic size={18} />
          </div>
          <div
            className="btn-secondary-glass"
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Paperclip size={18} />
          </div>
          <div
            className="glass-input-field"
            style={{
              flex: 1,
              padding: '0.8rem 1.2rem',
              fontSize: '0.92rem',
              color: 'var(--text-muted)'
            }}
          >
            Message {selectedConv?.partner_name || ''}...
          </div>
          <div
            className="btn-secondary-glass"
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Smile size={18} />
          </div>
          <div
            className="btn-primary-gradient"
            style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={18} />
          </div>
        </div>

        {/* 3. Luminous Liquid Glass Wavefront Ripple */}
        {normTime > 0.05 && normTime < 0.94 && (
          <div
            style={{
              position: 'absolute',
              left: `${originRelX}px`,
              top: `${originRelY}px`,
              width: `${currentRadius * 2}px`,
              height: `${currentRadius * 2}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `1.5px solid rgba(185, 140, 255, ${(1 - normTime) * 0.45})`,
              boxShadow: `0 0 25px rgba(185, 140, 255, ${(1 - normTime) * 0.35}), inset 0 0 20px rgba(184, 50, 104, ${(1 - normTime) * 0.25})`,
              pointerEvents: 'none',
              opacity: Math.sin(normTime * Math.PI)
            }}
          />
        )}
      </div>

      {/* 4. Subtle Premium Sparkles near the blooming origin */}
      {SPARKLES.map((sp) => {
        if (normTime < sp.startT || normTime > sp.endT) return null;
        const localT = (normTime - sp.startT) / (sp.endT - sp.startT);

        let opacity = 0;
        if (normTime < sp.peakT) {
          opacity = (normTime - sp.startT) / (sp.peakT - sp.startT);
        } else {
          opacity = 1 - (normTime - sp.peakT) / (sp.endT - sp.peakT);
        }
        opacity = Math.sin(opacity * Math.PI * 0.5);

        const sparkX = originRect.centerX + Math.cos(sp.angle) * sp.dist * localT;
        const sparkY = originRect.centerY + Math.sin(sp.angle) * sp.dist * localT;
        const scale = 0.5 + 0.6 * Math.sin(localT * Math.PI);

        return (
          <div
            key={sp.id}
            style={{
              position: 'fixed',
              left: `${sparkX}px`,
              top: `${sparkY}px`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 0 6px rgba(185, 140, 255, 0.9), 0 0 10px rgba(245, 243, 247, 0.95), 0 0 16px rgba(184, 50, 104, 0.7)',
              opacity: opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              pointerEvents: 'none',
              zIndex: 230
            }}
          >
            {/* Subtle optical cross refraction */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${sp.size * 2.8}px`,
                height: '1px',
                background: 'rgba(245, 243, 247, 0.85)',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px rgba(185, 140, 255, 0.8)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '1px',
                height: `${sp.size * 2.8}px`,
                background: 'rgba(245, 243, 247, 0.85)',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px rgba(185, 140, 255, 0.8)'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ChatFlowTransition;
