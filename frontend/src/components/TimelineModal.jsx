import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Heart, Volume2, Sparkles, Filter } from 'lucide-react';

export default function TimelineModal({ isOpen, onClose }) {
  const [memories, setMemories] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMemories();
    }
  }, [isOpen]);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    }
  };

  if (!isOpen) return null;

  const filtered = memories.filter(m => {
    if (filterType === 'all') return true;
    return m.media_type === filterType;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              CHRONOLOGICAL VIEW
            </span>
            <h2 className="modal-title">Archival Timeline Stream</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Format Filter Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 6 }}>
            {['all', 'visual_arts', 'motion', 'oral_history', 'journaling'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid #E2E8F0',
                  background: filterType === t ? '#08101E' : '#F8FAFC',
                  color: filterType === t ? '#FFFFFF' : '#475569',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Timeline Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 16, width: 2, background: '#E2E8F0', zIndex: 0 }}></div>

            {filtered.map((item, idx) => (
              <div key={item.id || idx} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 2 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#08101E', color: '#C5A059', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={16} />
                </div>

                <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {item.date_occurred || 'Past Era'} • {item.subtitle}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#08101E', margin: '4px 0' }}>
                        {item.title}
                      </h3>
                    </div>
                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 999, background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>
                      ● Restored
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>
                    {item.description}
                  </p>

                  {item.media_url && (
                    <div style={{ width: '100%', height: 200, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                      <img src={item.media_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #EEF2F6' }}>
                    <span style={{ fontSize: '11px', color: '#801323', fontWeight: 700 }}>
                      Resonance: {item.emotion}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                      Tags: {item.tags}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
