import React, { useState } from 'react';
import { X, Lock, User, Key, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('nanba');
  const [email, setEmail] = useState('nanba@soulsync.io');
  const [fullName, setFullName] = useState('Nanba');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { username, password } : { username, email, full_name: fullName, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const user = await res.json();
        setStatusMsg(`Identity verified as ${user.full_name || 'Nanba'}!`);
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => {
          setStatusMsg('');
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              IDENTITY GATEWAY
            </span>
            <h2 className="modal-title">{isLogin ? 'Sign In / Verification' : 'Create Identity Gateway'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 20 }}>
            Identity verification and credential management gateway for encrypted family archives.
          </p>

          {statusMsg ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Check size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#0F172A' }}>{statusMsg}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username / Handle</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Sanctuary Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Passcode / Cryptographic Key</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="primary-action-btn" disabled={loading}>
                <Lock size={16} />
                <span>{loading ? 'Verifying...' : isLogin ? 'Authenticate & Enter' : 'Create Identity Profile'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ background: 'none', border: 'none', color: '#475569', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isLogin ? "Need a new identity? Create Profile" : "Already have credentials? Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
