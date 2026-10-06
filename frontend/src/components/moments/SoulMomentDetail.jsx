import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Lock,
  Share2,
  Trash2,
  Bookmark,
  Check,
  Edit3,
  ExternalLink,
  FolderPlus
} from 'lucide-react';

const SoulMomentDetail = () => {
  const {
    activeMomentDetail,
    setActiveMomentDetail,
    momentCollections,
    handleUpdateMomentNote,
    handleSetMomentCollection,
    handleRemoveMoment,
    showToast,
    navigateTo
  } = useApp();

  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [selectedCollId, setSelectedCollId] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (activeMomentDetail) {
      setNoteText(activeMomentDetail.private_note || '');
      setSelectedCollId(activeMomentDetail.collection_id || null);
      setIsEditingNote(false);
      setSelectedPhotoIndex(0);
    }
  }, [activeMomentDetail]);

  if (!activeMomentDetail) return null;

  const handleSaveNote = async () => {
    await handleUpdateMomentNote(activeMomentDetail.id, noteText);
    setIsEditingNote(false);
  };

  const handleCollectionChange = async (e) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectedCollId(val);
    await handleSetMomentCollection(activeMomentDetail.id, val);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('Moment link copied to clipboard ✨');
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this moment from your Soul Moments? (Original post will not be deleted)')) {
      await handleRemoveMoment(activeMomentDetail.id);
    }
  };

  const formattedDate = () => {
    if (!activeMomentDetail.memory_date) return '';
    try {
      const d = new Date(activeMomentDetail.memory_date);
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return activeMomentDetail.memory_date;
    }
  };

  return (
    <div className="soul-moment-modal-backdrop" onClick={() => setActiveMomentDetail(null)}>
      <div
        className="liquid-glass-panel soul-moment-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Close Button */}
        <button
          className="soul-moment-modal-close-btn"
          onClick={() => setActiveMomentDetail(null)}
          aria-label="Close Moment Detail"
        >
          <X size={18} />
        </button>

        <div className="soul-moment-modal-layout">
          {/* Left / Top: High-Fidelity Media View */}
          {(() => {
            const photos = (() => {
              if (!activeMomentDetail.media_url) return [];
              if (Array.isArray(activeMomentDetail.media_url)) return activeMomentDetail.media_url;
              if (typeof activeMomentDetail.media_url === 'string' && activeMomentDetail.media_url.trim().startsWith('[')) {
                try {
                  const parsed = JSON.parse(activeMomentDetail.media_url);
                  if (Array.isArray(parsed)) return parsed;
                } catch {}
              }
              return [activeMomentDetail.media_url];
            })();

            return (
              <div className="soul-moment-modal-media-col">
                <div style={{ position: 'relative' }}>
                  <img
                    src={photos[selectedPhotoIndex || 0] || activeMomentDetail.media_url}
                    alt={activeMomentDetail.title || 'Moment Image'}
                    className="soul-moment-modal-img"
                  />
                  {photos.length > 1 && (
                    <div className="soul-moment-modal-count-pill">
                      <span>{(selectedPhotoIndex || 0) + 1} / {photos.length} photos</span>
                    </div>
                  )}
                  {activeMomentDetail.memory_type === 'on_this_day' && (
                    <div className="soul-moment-modal-ribbon">
                      <Sparkles size={13} color="#B98CFF" />
                      <span>{activeMomentDetail.years_ago === 1 ? '1 year ago today' : `${activeMomentDetail.years_ago || 2} years ago today`}</span>
                    </div>
                  )}
                </div>

                {/* Multi-Photo Thumbnails Carousel */}
                {photos.length > 1 && (
                  <div className="soul-moment-modal-thumbs-row">
                    {photos.map((pUrl, pIdx) => (
                      <img
                        key={pIdx}
                        src={pUrl}
                        alt={`Photo ${pIdx + 1}`}
                        className={`soul-moment-modal-thumb-item ${selectedPhotoIndex === pIdx ? 'active' : ''}`}
                        onClick={() => setSelectedPhotoIndex(pIdx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Right / Bottom: Memory Details & Private Reflection */}
          <div className="soul-moment-modal-info-col">
            {/* Meta Tags */}
            <div className="soul-moment-modal-meta">
              <div className="soul-moment-modal-date">
                <Calendar size={13} />
                <span>{formattedDate()}</span>
              </div>
              {activeMomentDetail.location && (
                <div className="soul-moment-modal-location">
                  <MapPin size={13} />
                  <span>{activeMomentDetail.location}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="soul-moment-modal-title">
              {activeMomentDetail.title || 'Soul Moment'}
            </h3>

            {/* Original Caption */}
            {activeMomentDetail.caption && (
              <p className="soul-moment-modal-caption">
                "{activeMomentDetail.caption}"
              </p>
            )}

            {/* People Involved */}
            {activeMomentDetail.people_involved && (
              <div className="soul-moment-modal-people-tag">
                <Users size={14} color="#B98CFF" />
                <span>With: {activeMomentDetail.people_involved}</span>
              </div>
            )}

            {/* Private Memory Note Section */}
            <div className="soul-moment-note-section">
              <div className="soul-moment-note-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B98CFF', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Lock size={12} />
                  <span>Private Memory Note</span>
                </div>
                {!isEditingNote && (
                  <button
                    className="soul-moment-note-edit-btn"
                    onClick={() => setIsEditingNote(true)}
                  >
                    <Edit3 size={12} />
                    <span>{noteText ? 'Edit Note' : 'Add Note'}</span>
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="soul-moment-note-editor">
                  <textarea
                    rows={3}
                    placeholder="Attach a private personal reflection (e.g., 'One of my favorite college memories.'). Only visible to you."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="soul-moment-note-textarea"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="btn-secondary-glass"
                      onClick={() => setIsEditingNote(false)}
                      style={{ fontSize: '0.76rem', padding: '0.35rem 0.8rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-primary-gradient"
                      onClick={handleSaveNote}
                      style={{ fontSize: '0.76rem', padding: '0.35rem 0.95rem' }}
                    >
                      <Check size={12} />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="soul-moment-note-display">
                  {noteText ? (
                    <p style={{ fontStyle: 'italic', margin: 0 }}>"{noteText}"</p>
                  ) : (
                    <span style={{ opacity: 0.5, fontStyle: 'italic' }}>
                      No private note added yet. Click 'Add Note' to record your reflection.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Collection Assignment Dropdown */}
            <div className="soul-moment-collection-select-wrap">
              <label htmlFor="moment-coll-select" style={{ fontSize: '0.78rem', color: '#A9ADBC', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FolderPlus size={12} />
                <span>Collection:</span>
              </label>
              <select
                id="moment-coll-select"
                value={selectedCollId || ''}
                onChange={handleCollectionChange}
                className="soul-moment-collection-select"
              >
                <option value="">None (Uncategorized)</option>
                {momentCollections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Actions Footer */}
            <div className="soul-moment-modal-actions">
              {activeMomentDetail.post_id && (
                <button
                  className="btn-secondary-glass soul-moment-action-btn"
                  onClick={() => {
                    setActiveMomentDetail(null);
                    navigateTo('home');
                    showToast('Viewing original post');
                  }}
                  title="View original post on home feed"
                >
                  <ExternalLink size={13} />
                  <span>Original Post</span>
                </button>
              )}

              <button
                className="btn-secondary-glass soul-moment-action-btn"
                onClick={handleShare}
                title="Share this moment"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>

              <button
                className="btn-secondary-glass soul-moment-action-btn delete-btn"
                onClick={handleRemove}
                title="Remove from Soul Moments"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulMomentDetail;
