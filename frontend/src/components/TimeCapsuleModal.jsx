import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Clock, Plus, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TimeCapsuleModal({ isOpen, onClose }) {
  const [capsules, setCapsules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unlockDate, setUnlockDate] = useState('2027-01-01');
  const [releaseMessage, setReleaseMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCapsules();
    }
  }, [isOpen]);

  const fetchCapsules = async () => {
    try {
      const res = await fetch('/api/time-capsules');
      if (res.ok) {
        const data = await res.json();
        setCapsules(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSealCapsule = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch('/api/time-capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          unlock_date: unlockDate,
          release_message: releaseMessage
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setReleaseMessage('');
        setIsCreating(false);
        fetchCapsules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlock = async (id) => {
    try {
      const res = await fetch(`/api/time-capsules/${id}/unlock`, { method: 'POST' });
      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#C5A059', '#FCE8C3', '#801323']
        });
        fetchCapsules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              SCHEDULED RELEASE
            </span>
            <h2 className="modal-title">Time Capsule Vaults</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
              Encrypted digital sanctuaries sealed until future anniversaries and milestones.
            </p>
            <button
              onClick={() => setIsCreating(!isCreating)}
              style={{
                background: isCreating ? '#F1F5F9' : '#08101E',
                color: isCreating ? '#08101E' : '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Plus size={16} />
              <span>{isCreating ? 'View Sealed Vaults' : 'Seal New Capsule'}</span>
            </button>
          </div>

          {isCreating ? (
            <form onSubmit={handleSealCapsule}>
              <div className="form-group">
                <label className="form-label">Capsule Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Letters for our 10th Anniversary"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scheduled Unlock Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={unlockDate}
                  onChange={e => setUnlockDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Included Artifacts</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="What memories, audio files, or letters are vaulted inside?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Future Self Revelation Message</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="A note to be read upon unlock..."
                  value={releaseMessage}
                  onChange={e => setReleaseMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="primary-action-btn">
                <Lock size={16} />
                <span>Seal Capsule with Cryptographic Lock</span>
              </button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {capsules.map(cap => (
                <div
                  key={cap.id}
                  style={{
                    background: cap.is_locked ? '#091120' : '#F0FDF4',
                    border: cap.is_locked ? '1px solid #1E2D4A' : '1.5px solid #86EFAC',
                    borderRadius: 14,
                    padding: 20,
                    color: cap.is_locked ? '#FFFFFF' : '#0F172A',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '10px', letterSpacing: '0.15em', fontWeight: 800, color: cap.is_locked ? '#C5A059' : '#16A34A', textTransform: 'uppercase' }}>
                        {cap.is_locked ? '🔒 SEALED VAULT' : '✨ RELEASED'}
                      </span>
                      <span style={{ fontSize: '11px', color: cap.is_locked ? '#94A3B8' : '#64748B' }}>
                        {cap.unlock_date}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: 8, color: cap.is_locked ? '#FFFFFF' : '#0F172A' }}>
                      {cap.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: cap.is_locked ? '#94A3B8' : '#475569', lineHeight: 1.45, marginBottom: 16 }}>
                      {cap.description}
                    </p>

                    {!cap.is_locked && (
                      <div style={{ background: '#FFFFFF', borderRadius: 8, padding: '10px 12px', border: '1px solid #DCFCE7', fontSize: '0.85rem', color: '#15803D', fontStyle: 'italic', marginBottom: 16 }}>
                        "{cap.release_message}"
                      </div>
                    )}
                  </div>

                  {cap.is_locked ? (
                    <button
                      onClick={() => handleUnlock(cap.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#F8D8A0',
                        padding: '8px 14px',
                        borderRadius: 8,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      <Unlock size={14} />
                      <span>Unlock Vault Now</span>
                    </button>
                  ) : (
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textAlign: 'center' }}>
                      ✓ Memory Capsule Open
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
