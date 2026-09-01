import React, { useState, useEffect } from 'react';
import { X, User, Crown, Shield, HardDrive, CheckCircle } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(d => setUser(d))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              USER CREDENTIALS
            </span>
            <h2 className="modal-title">Account & Membership</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.35)',
              color: '#FFFFFF'
            }}>
              <User size={36} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#08101E' }}>
                  {user?.full_name || 'Nanba'}
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FCE8C3', color: '#78350F', padding: '3px 10px', borderRadius: 999, fontSize: '10.5px', fontWeight: 800 }}>
                  <Crown size={12} />
                  <span>PREMIUM</span>
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 2 }}>{user?.email || 'nanba@soulsync.io'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>SUBSCRIPTION TIER</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#08101E' }}>{user?.subscription_status || 'Premium Member'}</div>
              <div style={{ fontSize: '11px', color: '#16A34A', marginTop: 4 }}>✓ Unlimited Sensory Archival</div>
            </div>

            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: 4 }}>ENCRYPTION STATUS</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#08101E' }}>End-to-End Vaulted</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: 4 }}>Zero-Knowledge Protection</div>
            </div>
          </div>

          <div style={{ background: '#091120', borderRadius: 14, padding: 20, color: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '11px', color: '#C5A059', fontWeight: 700, letterSpacing: '0.15em' }}>VAULT STORAGE CONSUMPTION</span>
              <span style={{ fontSize: '11px', color: '#CBD5E1' }}>12.4 GB / 2 TB</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '6%', height: '100%', background: '#C5A059' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
