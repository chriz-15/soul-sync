import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function GalleryModal({ isOpen, onClose }) {
  const [memories, setMemories] = useState([]);
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/memories')
        .then(res => res.json())
        .then(data => setMemories(data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 960 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              MEDIA GALLERY
            </span>
            <h2 className="modal-title">Visual Arts & High-Fidelity Gallery</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {memories.map(m => (
              <div
                key={m.id}
                onClick={() => setActiveMedia(m)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src={m.media_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'}
                  alt={m.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px 12px 10px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  color: '#FFFFFF'
                }}>
                  <div style={{ fontSize: '9.5px', color: '#FCE8C3', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    {m.date_occurred}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 700 }}>
                    {m.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeMedia && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40
              }}
              onClick={() => setActiveMedia(null)}
            >
              <div style={{ maxWidth: 800, textAlign: 'center', color: '#FFFFFF' }}>
                <img
                  src={activeMedia.media_url}
                  alt={activeMedia.title}
                  style={{ maxHeight: '70vh', maxWidth: '100%', borderRadius: 12, marginBottom: 16 }}
                />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFFFFF' }}>{activeMedia.title}</h3>
                <p style={{ color: '#94A3B8', marginTop: 6 }}>{activeMedia.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
