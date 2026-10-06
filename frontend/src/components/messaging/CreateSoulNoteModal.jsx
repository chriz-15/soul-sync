import React, { useState, useEffect } from 'react';
import { X, Sparkles, Music, Play, Square, Check, Heart, Plus } from 'lucide-react';
import { playSongPreview, stopCurrentSong, playDoubleTapPing } from './soulAudioEngine';

const AVAILABLE_SOUNDTRACKS = [
  {
    id: 'track-calm',
    title: 'Calm Vibes',
    artist: 'Lo-fi',
    category: 'Relaxing',
    scale: 'pentatonic',
    bpm: 78
  },
  {
    id: 'track-midnight',
    title: 'Midnight Rain',
    artist: 'Ambient',
    category: 'Atmospheric',
    scale: 'minor',
    bpm: 64
  },
  {
    id: 'track-golden',
    title: 'Golden Hour',
    artist: 'Soulful',
    category: 'Warmth',
    scale: 'major',
    bpm: 88
  },
  {
    id: 'track-silent',
    title: 'Silent Thoughts',
    artist: 'Piano',
    category: 'Peaceful',
    scale: 'acoustic',
    bpm: 72
  }
];

const QUICK_PROMPTS = [
  'Good things take time...',
  'Lost in the ocean of thoughts 🌊',
  'Dancing with the midnight rain 🌧️',
  'Quiet mind, peaceful soul 🕯️',
  'Vibrating at 528Hz ✨'
];

const CreateSoulNoteModal = ({
  isOpen,
  onClose,
  initialNote = 'Good things take time...',
  initialMusic = { title: 'Calm Vibes', artist: 'Lo-fi' },
  currentUser,
  onSaveNote
}) => {
  const [noteText, setNoteText] = useState(initialNote);
  const [selectedMusic, setSelectedMusic] = useState(initialMusic);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNoteText(initialNote || 'Good things take time...');
      setSelectedMusic(initialMusic || AVAILABLE_SOUNDTRACKS[0]);
      setIsClosing(false);
    } else {
      stopCurrentSong();
      setPlayingTrackId(null);
    }
  }, [isOpen, initialNote, initialMusic]);

  // Clean up audio preview when modal unmounts
  useEffect(() => {
    return () => {
      stopCurrentSong();
    };
  }, []);

  if (!isOpen && !isClosing) return null;

  const handleSmoothClose = () => {
    stopCurrentSong();
    setPlayingTrackId(null);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 240);
  };

  const handleTogglePlay = (track, e) => {
    e.stopPropagation();
    if (playingTrackId === track.id) {
      stopCurrentSong();
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      playSongPreview(
        track,
        () => {},
        () => setPlayingTrackId(null)
      );
    }
  };

  const handleSave = () => {
    playDoubleTapPing();
    onSaveNote({
      note: noteText.trim() || 'Good things take time...',
      music: selectedMusic
    });
    handleSmoothClose();
  };

  const currentAvatar =
    currentUser?.avatar_url ||
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const currentUsername =
    currentUser?.username ||
    currentUser?.name ||
    'Chrichuzz';

  return (
    <div
      className={`soul-note-modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleSmoothClose}
    >
      <div
        className="soul-note-create-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="soul-note-create-header">
          <div className="soul-note-create-title-block">
            <h3 className="soul-note-create-title">
              <span>Soul Note</span>
              <Sparkles size={16} color="#B98CFF" />
            </h3>
            <span className="soul-note-create-sub">
              Share what's resonating in your soul right now
            </span>
          </div>

          <button
            type="button"
            className="soul-note-close-btn"
            onClick={handleSmoothClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Real-Time Live Preview Card */}
        <div className="soul-note-preview-wrapper">
          <div className="soul-note-card" style={{ transform: 'none', cursor: 'default' }}>
            <div className="soul-note-twilight-backdrop" />
            <div className="soul-note-fluid-lip" />
            <div className="soul-note-specular-glint" />
            <div className="soul-note-top-glint" />

            <div className="soul-note-inner">
              {/* Top Row */}
              <div className="soul-note-top-row">
                <div className="soul-note-user-meta">
                  <div className="soul-note-avatar-wrapper">
                    <img
                      src={currentAvatar}
                      alt={currentUsername}
                      className="soul-note-avatar-img"
                    />
                  </div>
                  <div className="soul-note-author-info">
                    <span className="soul-note-author-name">
                      {currentUsername}
                      <span className="soul-note-star-icon">✦</span>
                    </span>
                    <span className="soul-note-time">Just now</span>
                  </div>
                </div>

                <div className="soul-note-sparkles-cluster">
                  <span>✦</span>
                  <span className="soul-note-sparkle-sec">✧</span>
                </div>
              </div>

              {/* Body */}
              <div className="soul-note-body">
                <div className="soul-note-text">
                  {noteText.trim() || 'Good things take time...'}
                </div>
                <div className="soul-note-heart">♡</div>
              </div>

              {/* Bottom Row */}
              <div className="soul-note-bottom-row">
                <div className="soul-note-music-chip">
                  <div className={`soul-note-music-icon-wrap ${playingTrackId ? 'playing' : ''}`}>
                    ♫
                  </div>
                  <div className="soul-note-music-details">
                    <span className="soul-note-song-title">
                      {selectedMusic?.title || 'Calm Vibes'}
                    </span>
                    <span className="soul-note-song-genre">
                      {selectedMusic?.artist || 'Lo-fi'}
                    </span>
                  </div>
                </div>

                <div className="soul-note-add-btn" style={{ pointerEvents: 'none' }}>
                  <Plus size={8.5} strokeWidth={2.6} />
                  <span>Your Note</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note Text Input */}
        <div className="soul-note-input-group">
          <div className="soul-note-input-label-row">
            <label className="soul-note-input-label">Note Message</label>
            <span className="soul-note-char-count">{noteText.length}/100</span>
          </div>

          <textarea
            className="soul-note-textarea"
            placeholder="Good things take time..."
            value={noteText}
            maxLength={100}
            rows={2}
            onChange={(e) => setNoteText(e.target.value)}
            autoFocus
          />

          {/* Quick Prompts */}
          <div className="soul-note-presets-row">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="soul-note-preset-chip"
                onClick={() => setNoteText(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Music Selection */}
        <div className="soul-note-music-select-group">
          <label className="soul-note-input-label">Attach Soundtrack</label>
          <div className="soul-note-soundtrack-grid">
            {AVAILABLE_SOUNDTRACKS.map((track) => {
              const isSelected = selectedMusic?.title === track.title;
              const isPlaying = playingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`soul-note-soundtrack-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedMusic(track)}
                >
                  <div className="soul-note-track-meta">
                    <span className="soul-note-track-name">{track.title}</span>
                    <span className="soul-note-track-vibe">{track.artist}</span>
                  </div>

                  <button
                    type="button"
                    className="soul-note-track-play-btn"
                    onClick={(e) => handleTogglePlay(track, e)}
                    title={isPlaying ? 'Stop preview' : 'Play preview'}
                  >
                    {isPlaying ? <Square size={10} fill="#F5F3F7" /> : <Play size={11} fill="#F5F3F7" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="soul-note-create-actions">
          <button
            type="button"
            className="soul-note-cancel-btn"
            onClick={handleSmoothClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="soul-note-save-btn"
            onClick={handleSave}
          >
            <Check size={14} strokeWidth={2.6} />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSoulNoteModal;
