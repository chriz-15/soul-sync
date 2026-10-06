import React, { useState } from 'react';
import {
  X,
  Music,
  Heart,
  Sparkles,
  Send,
  MessageCircle,
  Play,
  Pause,
  Smile,
  Disc3
} from 'lucide-react';
import { ORGANIC_SHAPES } from './soulSignatureData';

/**
 * SoulNoteModal — Floating Liquid Note Inspector & Creator
 * Handles both:
 * 1. Viewing a friend's Soul Note, listening to their soundtrack, sending instant reaction
 * 2. Editing/Creating your own Soul Note with quick vibes & attached song
 */
const SoulNoteModal = ({
  signature,
  isSelf = false,
  isPlayingThisSong = false,
  onPlaySong,
  onPauseSong,
  onUpdateSelfNote,
  onOpenMusicPicker,
  onNavigateToChat,
  onSendReaction,
  onClose
}) => {
  if (!signature) return null;

  // Edit note state for self
  const [noteText, setNoteText] = useState(signature.note || '');
  const [selectedVibe, setSelectedVibe] = useState(signature.vibeTag || 'Deep Focus');

  const QUICK_VIBES = [
    { label: '✨ 528Hz Resonance', text: 'Vibrating at 528Hz ✨' },
    { label: '🌊 Ocean Mind', text: 'Ocean state of mind 🌊' },
    { label: '🎧 Deep Flow', text: 'Lost in the frequency 🎧' },
    { label: '☕️ Rainy Day', text: 'Rain drops & warm coffee ☕️' },
    { label: '🌙 Midnight Soul', text: 'Late night quiet thoughts 🌙' }
  ];

  const handleSaveSelf = (e) => {
    e.preventDefault();
    if (onUpdateSelfNote) {
      onUpdateSelfNote({
        note: noteText.trim(),
        vibeTag: selectedVibe
      });
    }
    onClose();
  };

  const shapePath = ORGANIC_SHAPES[(signature.shapeIndex || 0) % ORGANIC_SHAPES.length];

  return (
    <div
      className="soul-note-overlay"
      onClick={onClose}
      role="dialog"
      aria-label={`${signature.name}'s Soul Note`}
    >
      <div
        className="soul-note-card liquid-glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="soul-note-card-header">
          <div className="soul-note-header-user">
            {/* Mini organic avatar */}
            <div className="soul-note-mini-avatar-wrap">
              <svg viewBox="0 0 100 100" className="soul-note-mini-svg">
                <clipPath id={`note-clip-${signature.id}`}>
                  <path d={shapePath} />
                </clipPath>
                <image
                  href={signature.avatar}
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#note-clip-${signature.id})`}
                />
                <path
                  d={shapePath}
                  fill="none"
                  stroke="#B98CFF"
                  strokeWidth="3"
                  opacity="0.8"
                />
              </svg>
            </div>

            <div>
              <div className="soul-note-user-name">
                {isSelf ? 'Your Soul Note' : signature.name}
              </div>
              <div className="soul-note-frequency-match">
                <Sparkles size={11} className="frequency-star" />
                <span>{signature.frequency || '96%'} Resonance</span>
                {signature.noteTimestamp && (
                  <span className="soul-note-time">• {signature.noteTimestamp}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="soul-music-close-btn"
            onClick={onClose}
            aria-label="Close Note"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        {isSelf ? (
          /* =====================================
             MODE A: EDIT YOUR OWN SOUL NOTE
             ===================================== */
          <form onSubmit={handleSaveSelf} className="soul-note-edit-body">
            <div className="soul-note-input-label">What is your current thought or frequency?</div>
            <div className="soul-note-textarea-wrap">
              <input
                type="text"
                maxLength={60}
                className="soul-note-input"
                placeholder="Share a thought, feeling, or lyric..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                autoFocus
              />
              <span className="soul-note-counter">{noteText.length}/60</span>
            </div>

            {/* Quick Vibe Chips */}
            <div className="soul-note-vibe-chips">
              {QUICK_VIBES.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  className={`soul-vibe-chip ${noteText === v.text ? 'active' : ''}`}
                  onClick={() => {
                    setNoteText(v.text);
                    setSelectedVibe(v.label);
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Attached Music Pill */}
            <div className="soul-note-music-attach-section">
              <div className="soul-note-input-label">Resonance Soundtrack</div>
              <div className="soul-note-attached-song-row">
                {signature.music ? (
                  <>
                    <img
                      src={signature.music.artwork}
                      alt={signature.music.title}
                      className="soul-note-attached-art"
                    />
                    <div className="soul-note-attached-meta">
                      <div className="soul-note-attached-title">
                        {signature.music.title}
                      </div>
                      <div className="soul-note-attached-artist">
                        {signature.music.artist} • {signature.music.lang}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="soul-note-no-music">No song attached yet</div>
                )}

                <button
                  type="button"
                  className="soul-note-change-music-btn"
                  onClick={() => {
                    onClose();
                    onOpenMusicPicker(signature);
                  }}
                >
                  <Music size={12} />
                  <span>{signature.music ? 'Change' : 'Choose Song'}</span>
                </button>
              </div>
            </div>

            {/* Save Action */}
            <button type="submit" className="btn-primary-gradient soul-note-save-btn">
              <span>Update Soul Signature</span>
            </button>
          </form>
        ) : (
          /* =====================================
             MODE B: VIEW FRIEND'S SOUL NOTE
             ===================================== */
          <div className="soul-note-view-body">
            {/* The Note Quote */}
            <div className="soul-note-view-quote">
              <div className="soul-note-quote-mark">“</div>
              <p className="soul-note-quote-text">
                {signature.note || 'Present in this moment.'}
              </p>
            </div>

            {/* Attached Song Card */}
            {signature.music && (
              <div
                className={`soul-note-song-card ${isPlayingThisSong ? 'is-playing' : ''}`}
                onClick={() => {
                  if (isPlayingThisSong) onPauseSong();
                  else onPlaySong(signature.music);
                }}
              >
                <div className="soul-note-song-art-box">
                  <img
                    src={signature.music.artwork}
                    alt={signature.music.title}
                    className="soul-note-song-card-img"
                  />
                  <div className="soul-note-song-play-badge">
                    {isPlayingThisSong ? (
                      <Pause size={12} fill="#F5F3F7" />
                    ) : (
                      <Play size={12} fill="#F5F3F7" />
                    )}
                  </div>
                </div>

                <div className="soul-note-song-meta">
                  <div className="soul-note-song-title">
                    {signature.music.title}
                  </div>
                  <div className="soul-note-song-artist">
                    {signature.music.artist} • {signature.music.lang}
                  </div>
                </div>

                {isPlayingThisSong && (
                  <div className="soul-song-live-eq">
                    <span className="eq-bar bar-1" />
                    <span className="eq-bar bar-2" />
                    <span className="eq-bar bar-3" />
                  </div>
                )}
              </div>
            )}

            {/* Quick Emotional Reactions Bar */}
            <div className="soul-note-reactions-row">
              <span className="soul-note-react-label">Send feeling:</span>
              <div className="soul-note-emojis">
                {['❤️', '✨', '🌊', '🔥', '💫'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="soul-note-emoji-btn"
                    onClick={() => {
                      if (onSendReaction) onSendReaction(signature.id, emoji);
                    }}
                    title={`Send ${emoji} to ${signature.name}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Action */}
            <button
              type="button"
              className="soul-note-message-btn"
              onClick={() => {
                onClose();
                if (onNavigateToChat) onNavigateToChat(signature.name);
              }}
            >
              <MessageCircle size={15} />
              <span>Message {signature.name}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoulNoteModal;
