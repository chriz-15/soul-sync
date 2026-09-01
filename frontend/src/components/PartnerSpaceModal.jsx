import React, { useState, useEffect } from 'react';
import { X, Heart, Users, Sparkles, Send, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PartnerSpaceModal({ isOpen, onClose }) {
  const [partnerData, setPartnerData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [pulseSent, setPulseSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPartnerData();
    }
  }, [isOpen]);

  const fetchPartnerData = async () => {
    try {
      const res = await fetch('/api/partner');
      if (res.ok) {
        const data = await res.json();
        setPartnerData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPulse = async () => {
    try {
      const res = await fetch('/api/partner/pulse', { method: 'POST' });
      if (res.ok) {
        setPulseSent(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF5E7E', '#C850C0', '#FFB6C1']
        });
        setTimeout(() => setPulseSent(false), 2500);
        fetchPartnerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    try {
      const res = await fetch('/api/partner/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote })
      });
      if (res.ok) {
        setNewNote('');
        fetchPartnerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              SHARED REPOSITORY
            </span>
            <h2 className="modal-title">Partner Space & Sanctuary</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Partner Hero Header */}
          <div style={{
            background: 'linear-gradient(135deg, #091120 0%, #152238 100%)',
            borderRadius: 16,
            padding: 24,
            color: '#FFFFFF',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={partnerData?.partner_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                  alt="Partner"
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #C5A059' }}
                />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: '#22C55E', border: '2px solid #091120' }}></div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFFFFF' }}>
                  {partnerData?.name || "Nanba & Alex Sanctuary"}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                  Shared Vault: {partnerData?.shared_memories_count || 42} Moments Sealed
                </p>
              </div>
            </div>

            <button
              onClick={handleSendPulse}
              style={{
                background: pulseSent ? '#EC4899' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: 999,
                padding: '10px 18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: '0.2s'
              }}
            >
              <Heart size={16} fill={pulseSent ? '#FFFFFF' : 'none'} color="#FF5E7E" />
              <span>{pulseSent ? 'Pulse Sent ❤️' : 'Send Heartbeat Pulse'}</span>
            </button>
          </div>

          {/* Sync Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Activity size={16} color="#16A34A" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.1em' }}>SYNC HEALTH</span>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                {partnerData?.sync_status || "Active Sync (Heartbeat 98%)"}
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Sparkles size={16} color="#C5A059" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.1em' }}>LAST CONNECTION</span>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                {partnerData?.last_interaction || "Just now"}
              </p>
            </div>
          </div>

          {/* Shared Love Note */}
          <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#9A3412', letterSpacing: '0.1em' }}>
              ACTIVE SHARED WHISPER
            </span>
            <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '1.1rem', color: '#7C2D12', marginTop: 8, lineHeight: 1.5 }}>
              "{partnerData?.love_notes || "Always cherish the laughter during our midnight walks under the stars."}"
            </p>
          </div>

          {/* Add New Whisper */}
          <form onSubmit={handleAddNote} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Leave a new love note or shared thought for Alex..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <button
              type="submit"
              style={{
                background: '#08101E',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '0 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700
              }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
