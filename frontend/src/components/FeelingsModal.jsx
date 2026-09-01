import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Activity, Check } from 'lucide-react';

export default function FeelingsModal({ isOpen, onClose }) {
  const [options, setOptions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedMood, setSelectedMood] = useState('Nostalgic Warmth');
  const [intensity, setIntensity] = useState(8);
  const [reflection, setReflection] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [resOpts, resLogs] = await Promise.all([
        fetch('/api/feelings/options'),
        fetch('/api/feelings')
      ]);
      if (resOpts.ok) {
        const d = await resOpts.json();
        setOptions(d.resonances || []);
      }
      if (resLogs.ok) {
        const l = await resLogs.json();
        setLogs(l);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogFeeling = async (e) => {
    e.preventDefault();
    try {
      const activeOpt = options.find(o => o.label === selectedMood) || { emoji: '✨' };
      const res = await fetch('/api/feelings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood_label: selectedMood,
          emoji: activeOpt.emoji,
          intensity,
          reflection: reflection || `Resonating with ${selectedMood}`
        })
      });

      if (res.ok) {
        setIsLogged(true);
        setReflection('');
        setTimeout(() => setIsLogged(false), 2000);
        loadData();
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
              EMOTIONAL SANCTUARY
            </span>
            <h2 className="modal-title">Explore Your Feelings</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 20 }}>
            Tune into your inner resonance and capture the subtle emotional frequencies of your moments.
          </p>

          <form onSubmit={handleLogFeeling} style={{ marginBottom: 28 }}>
            <div className="form-group">
              <label className="form-label">Current Emotional Resonance</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {options.map((opt, idx) => {
                  const isSelected = selectedMood === opt.label;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedMood(opt.label)}
                      style={{
                        padding: '14px 10px',
                        borderRadius: 12,
                        border: isSelected ? '2px solid #08101E' : '1px solid #E2E8F0',
                        background: isSelected ? '#F8FAFC' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: '0.2s'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: 4 }}>{opt.emoji}</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{opt.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resonance Intensity: {intensity}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#08101E' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emotional Reflection</label>
              <input
                type="text"
                className="form-input"
                placeholder="What is grounding or elevating your spirit right now?"
                value={reflection}
                onChange={e => setReflection(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-action-btn">
              <Sparkles size={16} />
              <span>{isLogged ? 'Feeling Logged ✓' : 'Record Emotional Resonance'}</span>
            </button>
          </form>

          {/* Recent Mood History */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Recent Mood Frequency Logs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {logs.slice(0, 4).map((log, idx) => (
                <div key={log.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '20px' }}>{log.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{log.mood_label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{log.reflection}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#08101E', background: '#E2E8F0', padding: '4px 10px', borderRadius: 999 }}>
                    Intensity {log.intensity}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
