import React, { useState, useRef, useEffect } from 'react';
import SoulSignatureFrame from './SoulSignatureFrame';
import SoulMusicPanel from './SoulMusicPanel';
import SoulNoteModal from './SoulNoteModal';
import { INITIAL_SOUL_SIGNATURES } from './soulSignatureData';
import { playSongPreview, stopCurrentSong } from './soulAudioEngine';
import { useApp } from '../../context/AppContext';

/**
 * SoulSignatureStrip — Horizontal Discovery Strip for Soul Signatures
 *
 * Sits naturally between the Search Bar and the Filter Buttons (All / Personal / Groups).
 * Features:
 * - Horizontally scrollable strip of organic liquid-glass Soul Signature Frames
 * - Floating Liquid Music Panel expanding from the clicked music badge
 * - Interactive Soul Note Modal (inspector for friends, editor for self)
 * - Pure Web Audio synthesizer playback for previews
 * - Double-tap emotional heart bloom reaction handler
 */
const SoulSignatureStrip = ({ onSelectUserChat }) => {
  const { showToast } = useApp();
  const [signatures, setSignatures] = useState(INITIAL_SOUL_SIGNATURES);

  // Audio Playback State
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Music Panel Floating State
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const [activeMusicSignature, setActiveMusicSignature] = useState(null);

  // Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeNoteSignature, setActiveNoteSignature] = useState(null);

  const stripRef = useRef(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentSong();
    };
  }, []);

  // Audio control handlers
  const handlePlaySong = (song) => {
    setCurrentPlayingSong(song);
    setIsPlaying(true);
    setPlaybackProgress(0);

    playSongPreview(
      song,
      (progress) => setPlaybackProgress(progress),
      () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      }
    );
  };

  const handlePauseSong = () => {
    stopCurrentSong();
    setIsPlaying(false);
  };

  // Open Music Panel from Frame's Music Icon
  const handleOpenMusic = (sig) => {
    setActiveMusicSignature(sig);
    setMusicPanelOpen(true);
    // If the signature has a song, start previewing it
    if (sig.music) {
      handlePlaySong(sig.music);
    }
  };

  // Open Note Modal from Note Pill or Frame
  const handleOpenNote = (sig) => {
    setActiveNoteSignature(sig);
    setNoteModalOpen(true);
  };

  // Double-tap reaction handler
  const handleReaction = (sigId, emoji = '❤️') => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.id === sigId
          ? { ...s, reactionsCount: (s.reactionsCount || 0) + 1 }
          : s
      )
    );
    const target = signatures.find((s) => s.id === sigId);
    if (target && !target.isSelf) {
      showToast(`Sent ${emoji} resonance to ${target.name}`);
    }
  };

  // Update own Soul Note
  const handleUpdateSelfNote = ({ note, vibeTag }) => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.isSelf
          ? { ...s, note, vibeTag, noteTimestamp: 'Just now' }
          : s
      )
    );
    showToast('Your Soul Note has been updated ✨');
  };

  // Attach selected song to self
  const handleSelectSongForSelf = (song) => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.isSelf
          ? { ...s, music: song }
          : s
      )
    );
    setActiveMusicSignature((prev) =>
      prev && prev.isSelf ? { ...prev, music: song } : prev
    );
    showToast(`Attached "${song.title}" to your Soul Note 🎵`);
    setMusicPanelOpen(false);
  };

  // Remove attached song from self (restores empty-state Music icon)
  const handleRemoveSongForSelf = () => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.isSelf
          ? { ...s, music: null }
          : s
      )
    );
    setActiveMusicSignature((prev) =>
      prev && prev.isSelf ? { ...prev, music: null } : prev
    );
    stopCurrentSong();
    setIsPlaying(false);
    showToast('Soundtrack removed from your Soul Note');
    setMusicPanelOpen(false);
  };

  return (
    <div className="soul-signature-strip-container">
      {/* Visual Subtitle / Strip Header */}
      <div className="soul-signature-strip-header">
        <span className="soul-strip-tag">SOUL FREQUENCIES</span>
        <span className="soul-strip-hint">Double-tap to resonate</span>
      </div>

      {/* Horizontal Scroll Area */}
      <div ref={stripRef} className="soul-signature-horizontal-scroll">
        {signatures.map((sig) => {
          const isThisSongPlaying =
            isPlaying && currentPlayingSong?.id === sig.music?.id;

          return (
            <SoulSignatureFrame
              key={sig.id}
              signature={sig}
              isPlayingThisSong={isThisSongPlaying}
              onOpenMusic={handleOpenMusic}
              onOpenNote={handleOpenNote}
              onReaction={handleReaction}
            />
          );
        })}
      </div>

      {/* Floating Liquid Music Panel */}
      {musicPanelOpen && (
        <SoulMusicPanel
          targetSignature={activeMusicSignature}
          currentPlayingSong={currentPlayingSong}
          isPlaying={isPlaying}
          playbackProgress={playbackProgress}
          onPlaySong={handlePlaySong}
          onPauseSong={handlePauseSong}
          onSelectSongForSelf={handleSelectSongForSelf}
          onRemoveSongForSelf={handleRemoveSongForSelf}
          onReaction={(sigId, emoji) => handleReaction(sigId, emoji)}
          onClose={() => setMusicPanelOpen(false)}
        />
      )}

      {/* Floating Liquid Note Modal */}
      {noteModalOpen && (
        <SoulNoteModal
          signature={activeNoteSignature}
          isSelf={activeNoteSignature?.isSelf}
          isPlayingThisSong={
            isPlaying && currentPlayingSong?.id === activeNoteSignature?.music?.id
          }
          onPlaySong={handlePlaySong}
          onPauseSong={handlePauseSong}
          onUpdateSelfNote={handleUpdateSelfNote}
          onOpenMusicPicker={(sig) => {
            setActiveMusicSignature(sig);
            setMusicPanelOpen(true);
          }}
          onNavigateToChat={(partnerName) => {
            if (onSelectUserChat) onSelectUserChat(partnerName);
          }}
          onSendReaction={(sigId, emoji) => handleReaction(sigId, emoji)}
          onClose={() => setNoteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SoulSignatureStrip;
