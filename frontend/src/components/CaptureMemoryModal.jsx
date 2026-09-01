import React, { useState } from 'react';
import { X, Camera, Video, Mic, FileText, Sparkles, Upload, Check } from 'lucide-react';

export default function CaptureMemoryModal({ isOpen, onClose, onMemoryCreated }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState('visual_arts');
  const [mediaUrl, setMediaUrl] = useState('');
  const [dateOccurred, setDateOccurred] = useState('Today');
  const [tags, setTags] = useState('Family, Celebration');
  const [emotion, setEmotion] = useState('Nostalgic Warmth');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const sampleImages = {
    visual_arts: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    motion: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    oral_history: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85',
    journaling: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=1200&q=85'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);

    try {
      const payload = {
        title,
        subtitle: subtitle || 'Archival Ingestion',
        description,
        media_type: mediaType,
        media_url: mediaUrl || sampleImages[mediaType],
        date_occurred: dateOccurred,
        tags,
        emotion,
        is_favorite: true,
        is_restored: true
      };

      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg('Memory successfully vaulted into the Living Archive!');
        if (onMemoryCreated) onMemoryCreated(data);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Error capturing memory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              MAIN INGESTION ENGINE
            </span>
            <h2 className="modal-title">Capture Memory</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {successMsg ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#0F172A', marginBottom: 8 }}>Archival Success</h3>
              <p style={{ color: '#64748B' }}>{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Media Format Selector */}
              <div className="form-group">
                <label className="form-label">Preservation Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {[
                    { id: 'visual_arts', label: 'Visual Arts', icon: Camera },
                    { id: 'motion', label: 'Motion', icon: Video },
                    { id: 'oral_history', label: 'Oral History', icon: Mic },
                    { id: 'journaling', label: 'Journaling', icon: FileText }
                  ].map(item => {
                    const Icon = item.icon;
                    const isSelected = mediaType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMediaType(item.id)}
                        style={{
                          background: isSelected ? '#08101E' : '#F8FAFC',
                          color: isSelected ? '#FFFFFF' : '#475569',
                          border: isSelected ? '1px solid #08101E' : '1px solid #E2E8F0',
                          borderRadius: 8,
                          padding: '10px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Memory Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. The Golden Hour Picnic"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Subtitle / Occasion</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Summer 2023"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date Occurred</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. August 14, 2023"
                    value={dateOccurred}
                    onChange={e => setDateOccurred(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sensory Reflection & Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the sights, acoustic atmosphere, and sensory emotion..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Emotional Resonance</label>
                  <select
                    className="form-select"
                    value={emotion}
                    onChange={e => setEmotion(e.target.value)}
                  >
                    <option value="Nostalgic Warmth">Nostalgic Warmth 🌅</option>
                    <option value="Pure Radiance">Pure Radiance ✨</option>
                    <option value="Quiet Serenity">Quiet Serenity 🌿</option>
                    <option value="Deep Connection">Deep Connection 💫</option>
                    <option value="Awe & Wonder">Awe & Wonder 🌌</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Archival Tags</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Family, Legacy, Milestone"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Media Image / Artifact URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="primary-action-btn"
                disabled={loading}
              >
                <Sparkles size={18} />
                <span>{loading ? 'Ingesting Memory...' : 'Vault into Living Archive'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
