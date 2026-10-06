import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Play,
  Pause,
  Sparkles,
  Headphones,
  Disc3,
  TrendingUp
} from 'lucide-react';
import {
  SOUL_MUSIC_CATALOG,
  MUSIC_CATEGORIES
} from './soulSignatureData';

/**
 * SoulMusicPanel — Floating Liquid Music Panel
 *
 * Strict Distinction (Rule 5):
 * - YOUR SOUL (isSelf = true): Full customization, song search, category tabs,
 *   full song browsing across all languages, preview playback, and "Attach to Note" action.
 * - OTHER USERS (isSelf = false): View-only discovery mode. Shows their selected
 *   soundtrack, audio preview playback with equalizer, resonance match, and reactions.
 *   Zero owner-only / customization controls.
 */
const SoulMusicPanel = ({
  targetSignature,
  currentPlayingSong,
  isPlaying,
  playbackProgress = 0,
  onPlaySong,
  onPauseSong,
  onSelectSongForSelf,
  onRemoveSongForSelf,
  onReaction,
  onClose
}) => {
  const isSelf = Boolean(targetSignature?.isSelf);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter songs for self customization mode
  const filteredSongs = useMemo(() => {
    let list = SOUL_MUSIC_CATALOG;

    if (selectedCategory === 'Trending 🔥') {
      list = list.filter((s) => s.isTrending);
    } else if (selectedCategory === 'Recent ⏱️') {
      list = list.slice(0, 6);
    } else if (selectedCategory !== 'All') {
      const langKey = selectedCategory.split(' ')[0].toLowerCase();
      list = list.filter(
        (s) =>
          s.lang.toLowerCase() === langKey ||
          s.category.toLowerCase() === langKey
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.lang.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div
      className={`soul-music-floating-panel liquid-glass-panel ${
        !isSelf ? 'is-view-only' : ''
      }`}
      role="dialog"
      aria-label="Soul Sync Music Discovery"
    >
      {/* ===================================================
          CASE A: OTHER USER'S SOUNDTRACK (VIEW / DISCOVER ONLY)
          =================================================== */}
      {!isSelf ? (
        <div className="soul-music-other-container">
          {/* Header */}
          <div className="soul-music-panel-header">
            <div className="soul-music-header-left">
              <div className="soul-music-header-icon-disc">
                <Disc3 size={18} className={isPlaying ? 'spinning' : ''} />
              </div>
              <div>
                <div className="soul-music-header-title">
                  {targetSignature?.name}'s Soundtrack
                </div>
                <div className="soul-music-header-subtitle">
                  {targetSignature?.music
                    ? `${targetSignature.name} has resonated with this song`
                    : 'No soundtrack selected'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="soul-music-close-btn"
              onClick={onClose}
              aria-label="Close Soundtrack Panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Soundtrack Card */}
          {targetSignature?.music ? (
            <div className="soul-music-other-view">
              <div className="soul-music-other-card">
                {/* Artwork + Play Overlay */}
                <div className="soul-music-other-art-wrap">
                  <img
                    src={targetSignature.music.artwork}
                    alt={targetSignature.music.title}
                    className="soul-music-other-art"
                  />
                  <button
                    type="button"
                    className="soul-music-other-play-badge"
                    onClick={() => {
                      if (
                        isPlaying &&
                        currentPlayingSong?.id === targetSignature.music.id
                      ) {
                        onPauseSong();
                      } else {
                        onPlaySong(targetSignature.music);
                      }
                    }}
                    aria-label="Play/Pause soundtrack"
                  >
                    {isPlaying &&
                    currentPlayingSong?.id === targetSignature.music.id ? (
                      <Pause size={18} fill="#F5F3F7" />
                    ) : (
                      <Play size={18} fill="#F5F3F7" />
                    )}
                  </button>
                </div>

                {/* Track Details */}
                <div className="soul-music-other-info">
                  <div className="soul-music-other-title">
                    {targetSignature.music.title}
                  </div>
                  <div className="soul-music-other-artist">
                    {targetSignature.music.artist}
                  </div>
                  <div className="soul-music-other-tags">
                    <span className="soul-song-lang-tag">
                      {targetSignature.music.lang}
                    </span>
                    <span className="soul-music-other-match">
                      <Sparkles size={11} />{' '}
                      {targetSignature.frequency || '96%'} Resonance
                    </span>
                    <span className="soul-song-duration">
                      {targetSignature.music.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Equalizer Wave when playing */}
              {isPlaying &&
                currentPlayingSong?.id === targetSignature.music.id && (
                  <div className="soul-music-other-eq-bar">
                    <span className="soul-np-indicator">
                      Resonating with {targetSignature.name}
                    </span>
                    <div className="soul-song-live-eq">
                      <span className="eq-bar bar-1" />
                      <span className="eq-bar bar-2" />
                      <span className="eq-bar bar-3" />
                      <span className="eq-bar bar-4" />
                    </div>
                  </div>
                )}

              {/* Emotional Reaction Bar */}
              <div className="soul-music-other-react-row">
                <span className="soul-music-react-label">
                  Resonate with this track:
                </span>
                <div className="soul-note-emojis">
                  {['❤️', '✨', '🔥', '🌊'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="soul-note-emoji-btn"
                      onClick={() => {
                        if (onReaction) onReaction(targetSignature.id, emoji);
                      }}
                      title={`Send ${emoji} resonance`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="soul-music-empty">
              <Headphones size={24} className="soul-music-empty-icon" />
              <p>{targetSignature?.name} hasn't selected a soundtrack yet.</p>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================
           CASE B: YOUR SOUL (FULL CUSTOMIZATION & SELECTION)
           =================================================== */
        <div className="soul-music-self-container">
          {/* Header */}
          <div className="soul-music-panel-header">
            <div className="soul-music-header-left">
              <div className="soul-music-header-icon-disc">
                <Disc3 size={18} className={isPlaying ? 'spinning' : ''} />
              </div>
              <div>
                <div className="soul-music-header-title">
                  Your Soul Soundtrack
                </div>
                <div className="soul-music-header-subtitle">
                  Choose a harmonic frequency for your Soul Note
                </div>
              </div>
            </div>

            <button
              type="button"
              className="soul-music-close-btn"
              onClick={onClose}
              aria-label="Close Music Panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Currently Selected Active Soundtrack (when a song is attached) */}
          {targetSignature?.music && (
            <div className="soul-music-current-selected-box">
              <div className="soul-music-current-info">
                <div className="soul-music-current-label">
                  <span className="soul-np-indicator">ACTIVE SOUL SOUNDTRACK</span>
                </div>
                <div className="soul-music-current-track">
                  <span className="soul-music-current-title">
                    {targetSignature.music.title}
                  </span>
                  <span className="soul-music-current-artist">
                    — {targetSignature.music.artist}
                  </span>
                </div>
              </div>

              <div className="soul-music-current-actions">
                <button
                  type="button"
                  className="soul-music-current-play-btn"
                  onClick={() => {
                    if (
                      isPlaying &&
                      currentPlayingSong?.id === targetSignature.music.id
                    ) {
                      onPauseSong();
                    } else {
                      onPlaySong(targetSignature.music);
                    }
                  }}
                  aria-label="Preview currently selected track"
                  title="Preview"
                >
                  {isPlaying &&
                  currentPlayingSong?.id === targetSignature.music.id ? (
                    <Pause size={13} fill="#F5F3F7" />
                  ) : (
                    <Play size={13} fill="#F5F3F7" />
                  )}
                </button>

                <button
                  type="button"
                  className="soul-music-remove-btn"
                  onClick={() => {
                    if (onRemoveSongForSelf) {
                      onRemoveSongForSelf();
                    }
                  }}
                  title="Remove this song from your Soul Note"
                  aria-label="Remove soundtrack"
                >
                  <X size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          {/* Elevated Liquid Search Field */}
          <div className="soul-music-search-wrap">
            <Search size={16} className="soul-music-search-icon" />
            <input
              type="text"
              placeholder="Search songs, artists, languages (e.g. Tamil, Anirudh, Sushin)..."
              className="soul-music-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="soul-music-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Language & Category Discovery Pills */}
          <div className="soul-music-categories-bar">
            {MUSIC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`soul-music-cat-pill ${
                  selectedCategory === cat ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Song List */}
          <div className="soul-music-song-list">
            {filteredSongs.length === 0 ? (
              <div className="soul-music-empty">
                <Headphones size={24} className="soul-music-empty-icon" />
                <p>No songs found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredSongs.map((song) => {
                const isThisPlaying =
                  isPlaying && currentPlayingSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    className={`soul-music-song-row ${
                      isThisPlaying ? 'is-playing' : ''
                    }`}
                    onClick={() => {
                      if (isThisPlaying) {
                        onPauseSong();
                      } else {
                        onPlaySong(song);
                      }
                    }}
                  >
                    {/* Artwork with play overlay */}
                    <div className="soul-song-art-wrap">
                      <img
                        src={song.artwork}
                        alt={song.title}
                        className="soul-song-art"
                      />
                      <div className="soul-song-play-overlay">
                        {isThisPlaying ? (
                          <Pause size={15} fill="#F5F3F7" />
                        ) : (
                          <Play size={15} fill="#F5F3F7" />
                        )}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="soul-song-meta">
                      <div className="soul-song-title-row">
                        <span className="soul-song-title">{song.title}</span>
                        {song.isTrending && (
                          <span className="soul-song-badge-trending">
                            <TrendingUp size={11} /> Trending
                          </span>
                        )}
                      </div>
                      <div className="soul-song-artist-row">
                        <span className="soul-song-artist">{song.artist}</span>
                        <span className="soul-song-lang-tag">{song.lang}</span>
                        <span className="soul-song-dot">•</span>
                        <span className="soul-song-duration">
                          {song.duration}
                        </span>
                      </div>
                    </div>

                    {/* Right Action: Equalizer or Attach */}
                    <div
                      className="soul-song-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isThisPlaying && (
                        <div className="soul-song-live-eq">
                          <span className="eq-bar bar-1" />
                          <span className="eq-bar bar-2" />
                          <span className="eq-bar bar-3" />
                          <span className="eq-bar bar-4" />
                        </div>
                      )}

                      <button
                        type="button"
                        className="soul-song-select-btn"
                        onClick={() => onSelectSongForSelf(song)}
                        title="Set this song on your Soul Note"
                      >
                        <Sparkles size={13} />
                        <span>Attach</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Now Playing Compact Liquid Dock */}
          {currentPlayingSong && (
            <div className="soul-music-now-playing-dock">
              <div className="soul-np-progress-track">
                <div
                  className="soul-np-progress-fill"
                  style={{ width: `${playbackProgress * 100}%` }}
                />
              </div>

              <div className="soul-np-content">
                <div className="soul-np-info">
                  <span className="soul-np-indicator">
                    {isPlaying ? 'Resonating Now' : 'Paused'}
                  </span>
                  <span className="soul-np-name">
                    {currentPlayingSong.title} — {currentPlayingSong.artist}
                  </span>
                </div>

                <button
                  type="button"
                  className="soul-np-toggle-btn"
                  onClick={() => {
                    if (isPlaying) onPauseSong();
                    else onPlaySong(currentPlayingSong);
                  }}
                  aria-label={isPlaying ? 'Pause Preview' : 'Play Preview'}
                >
                  {isPlaying ? (
                    <Pause size={16} fill="#F5F3F7" />
                  ) : (
                    <Play size={16} fill="#F5F3F7" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoulMusicPanel;
