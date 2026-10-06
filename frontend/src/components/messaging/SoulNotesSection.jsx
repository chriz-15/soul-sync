import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Heart } from 'lucide-react';
import { playSongPreview, stopCurrentSong, playDoubleTapPing } from './soulAudioEngine';
import { useApp } from '../../context/AppContext';
import CreateSoulNoteModal from './CreateSoulNoteModal';
import './soulNotes.css';

const DEFAULT_FRIEND_NOTES = [
  {
    id: 'note-megha',
    name: 'Megha',
    username: 'megha_official',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    note: 'Lost in the ocean of thoughts 🌊',
    time: '18m ago',
    music: { title: 'Midnight Rain', artist: 'Ambient', scale: 'minor', bpm: 64 },
    heartCount: 24,
    tiltClass: 'alt-tilt'
  },
  {
    id: 'note-arjun',
    name: 'Arjun',
    username: 'arjun_v',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    note: 'Coding dreams into reality ⚡',
    time: '45m ago',
    music: { title: 'Golden Hour', artist: 'Soulful', scale: 'major', bpm: 88 },
    heartCount: 19,
    tiltClass: ''
  },
  {
    id: 'note-priya',
    name: 'Priya',
    username: 'priya_visuals',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    note: 'Dancing with the midnight rain 🌧️',
    time: '1h ago',
    music: { title: 'Silent Thoughts', artist: 'Piano', scale: 'acoustic', bpm: 72 },
    heartCount: 31,
    tiltClass: 'alt-tilt'
  },
  {
    id: 'note-rohan',
    name: 'Rohan',
    username: 'rohan_lens',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    note: 'Vibrating at 528Hz peaceful frequency ✨',
    time: '2h ago',
    music: { title: 'Calm Vibes', artist: 'Lo-fi', scale: 'pentatonic', bpm: 78 },
    heartCount: 42,
    tiltClass: ''
  }
];

const SoulNotesSection = () => {
  const { currentUser, showToast } = useApp();

  // Persistent user note state
  const [userNote, setUserNote] = useState(() => {
    try {
      const saved = localStorage.getItem('soulsync_user_note');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      note: 'Good things take time...',
      time: 'Just now',
      music: {
        title: 'Calm Vibes',
        artist: 'Lo-fi',
        scale: 'pentatonic',
        bpm: 78
      }
    };
  });

  const [friendNotes, setFriendNotes] = useState(DEFAULT_FRIEND_NOTES);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [playingSongId, setPlayingSongId] = useState(null);

  // Stop music on unmount
  useEffect(() => {
    return () => {
      stopCurrentSong();
    };
  }, []);

  // Save new or updated user note
  const handleSaveNote = ({ note, music }) => {
    const updated = {
      note: note || 'Good things take time...',
      time: 'Just now',
      music: music || { title: 'Calm Vibes', artist: 'Lo-fi' }
    };
    setUserNote(updated);
    try {
      localStorage.setItem('soulsync_user_note', JSON.stringify(updated));
    } catch (e) {}
    showToast('Your Soul Note has been updated ✨');
  };

  // Toggle music playback
  const handleTogglePlaySong = (song, id, e) => {
    e.stopPropagation();
    if (playingSongId === id) {
      stopCurrentSong();
      setPlayingSongId(null);
    } else {
      setPlayingSongId(id);
      playSongPreview(
        song,
        () => {},
        () => setPlayingSongId(null)
      );
    }
  };

  // Friend resonate heart reaction
  const handleResonate = (friendId, friendName, e) => {
    e.stopPropagation();
    playDoubleTapPing();
    setFriendNotes((prev) =>
      prev.map((f) =>
        f.id === friendId ? { ...f, heartCount: f.heartCount + 1 } : f
      )
    );
    showToast(`Resonated with ${friendName}'s Soul Note ♡`);
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
    <>
      <section className="soul-notes-section" aria-label="Soul Notes">
        {/* Subtle Section Header */}
        <div className="soul-notes-header">
          <div className="soul-notes-header-left">
            <Sparkles size={13} color="#B98CFF" />
            <span className="soul-notes-title">Soul Notes</span>
            <span className="soul-notes-subtitle">• Ephemeral Frequencies</span>
          </div>
          <span className="soul-notes-hint">Double-tap to resonate</span>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="soul-notes-track">
          {/* ===================================================
              1. CURRENT USER'S PRIMARY SOUL NOTE CARD
              Exact Reference Visual Design:
              - Organic fluid glass silhouette
              - Top-left avatar, name, sparkle, time
              - Top-right dual star sparkles
              - Center handwritten cursive text & heart
              - Bottom-left music chip
              - Bottom-right + Add Note button
              =================================================== */}
          <div
            className="soul-note-card"
            onClick={() => setCreateModalOpen(true)}
            title="Click to edit your Soul Note"
          >
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
                    <span className="soul-note-time">{userNote.time || 'Just now'}</span>
                  </div>
                </div>

                <div className="soul-note-sparkles-cluster">
                  <span>✦</span>
                  <span className="soul-note-sparkle-sec">✧</span>
                </div>
              </div>

              {/* Center Body: Handwritten Expressive Script */}
              <div className="soul-note-body">
                <div className="soul-note-text">
                  {userNote.note || 'Good things take time...'}
                </div>
                <div className="soul-note-heart">♡</div>
              </div>

              {/* Bottom Row */}
              <div className="soul-note-bottom-row">
                <button
                  type="button"
                  className="soul-note-music-chip"
                  onClick={(e) =>
                    handleTogglePlaySong(userNote.music, 'user-note-song', e)
                  }
                  title={
                    playingSongId === 'user-note-song'
                      ? 'Pause Soundtrack'
                      : 'Play Soundtrack'
                  }
                >
                  <div
                    className={`soul-note-music-icon-wrap ${
                      playingSongId === 'user-note-song' ? 'playing' : ''
                    }`}
                  >
                    ♫
                  </div>
                  <div className="soul-note-music-details">
                    <span className="soul-note-song-title">
                      {userNote.music?.title || 'Calm Vibes'}
                    </span>
                    <span className="soul-note-song-genre">
                      {userNote.music?.artist || 'Lo-fi'}
                    </span>
                  </div>
                </button>

                {/* + Add Note Button Pill */}
                <button
                  type="button"
                  className="soul-note-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateModalOpen(true);
                  }}
                  title="Share or Edit Soul Note"
                >
                  <Plus size={8.5} strokeWidth={2.6} />
                  <span>Add Note</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================
              2. FRIENDS' SOUL NOTE CARDS (SAME VISUAL LANGUAGE)
              =================================================== */}
          {friendNotes.map((friend) => {
            const isPlaying = playingSongId === friend.id;

            return (
              <div
                key={friend.id}
                className={`soul-note-card ${friend.tiltClass}`}
                onDoubleClick={(e) => handleResonate(friend.id, friend.name, e)}
                title={`Double-tap to resonate with ${friend.name}`}
              >
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
                          src={friend.avatar}
                          alt={friend.name}
                          className="soul-note-avatar-img"
                        />
                      </div>
                      <div className="soul-note-author-info">
                        <span className="soul-note-author-name">
                          {friend.name}
                          <span className="soul-note-star-icon">✦</span>
                        </span>
                        <span className="soul-note-time">{friend.time}</span>
                      </div>
                    </div>

                    <div className="soul-note-sparkles-cluster">
                      <span>✦</span>
                      <span className="soul-note-sparkle-sec">✧</span>
                    </div>
                  </div>

                  {/* Center Body */}
                  <div className="soul-note-body">
                    <div className="soul-note-text">{friend.note}</div>
                    <div className="soul-note-heart">♡</div>
                  </div>

                  {/* Bottom Row */}
                  <div className="soul-note-bottom-row">
                    <button
                      type="button"
                      className="soul-note-music-chip"
                      onClick={(e) =>
                        handleTogglePlaySong(friend.music, friend.id, e)
                      }
                      title={isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
                    >
                      <div
                        className={`soul-note-music-icon-wrap ${
                          isPlaying ? 'playing' : ''
                        }`}
                      >
                        ♫
                      </div>
                      <div className="soul-note-music-details">
                        <span className="soul-note-song-title">
                          {friend.music.title}
                        </span>
                        <span className="soul-note-song-genre">
                          {friend.music.artist}
                        </span>
                      </div>
                    </button>

                    {/* Resonate Heart Button */}
                    <button
                      type="button"
                      className="soul-note-resonate-btn"
                      onClick={(e) => handleResonate(friend.id, friend.name, e)}
                      title={`Resonate with ${friend.name}`}
                    >
                      <Heart size={8} fill="#F5A3C4" color="#F5A3C4" />
                      <span>{friend.heartCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dedicated Fluid Liquid Create Soul Note Modal */}
      <CreateSoulNoteModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialNote={userNote.note}
        initialMusic={userNote.music}
        currentUser={currentUser}
        onSaveNote={handleSaveNote}
      />
    </>
  );
};

export default SoulNotesSection;
