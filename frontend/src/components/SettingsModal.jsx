import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Cpu, Sliders, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    privacy_mode: 'Encrypted Sanctuary',
    sensory_audio_engine: 'Spatial Binaural 3D',
    color_restoration_ai: 'Enabled',
    spatial_mic: 'Connected (96kHz)',
    smart_display: 'SoulSync Vault Frame'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(d => setSettings(prev => ({ ...prev, ...d })))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#C5A059', fontWeight: 800 }}>
              SYSTEM CONFIGURATION
            </span>
            <h2 className="modal-title">Global Settings & Hardware</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSave}>
            {/* Privacy Controls */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={16} />
                <span>Privacy & Vault Cryptography</span>
              </h4>
              <div className="form-group">
                <label className="form-label">Privacy Security Mode</label>
                <select
                  className="form-select"
                  value={settings.privacy_mode}
                  onChange={e => setSettings({ ...settings, privacy_mode: e.target.value })}
                >
                  <option value="Encrypted Sanctuary">Encrypted Sanctuary (Zero-Knowledge)</option>
                  <option value="Shared Household Vault">Shared Household Vault</option>
                  <option value="Offline Local Only">Offline Local Air-Gapped Only</option>
                </select>
              </div>
            </div>

            {/* Hardware Integration */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={16} />
                <span>Hardware & Sensory Peripherals</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Spatial Audio Mic</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.spatial_mic || 'Connected'}
                    onChange={e => setSettings({ ...settings, spatial_mic: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Smart Digital Canvas</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.smart_display || 'SoulSync Vault Frame'}
                    onChange={e => setSettings({ ...settings, smart_display: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* AI Enhancement Engine */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sliders size={16} />
                <span>Sensory Rendering Engine</span>
              </h4>
              <div className="form-group">
                <label className="form-label">Color & Acoustic Restoration Mode</label>
                <select
                  className="form-select"
                  value={settings.color_restoration_ai}
                  onChange={e => setSettings({ ...settings, color_restoration_ai: e.target.value })}
                >
                  <option value="Enabled">Neural Color Restoration (High Fidelity)</option>
                  <option value="Preserve Original">Preserve Raw Unaltered Grain</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-action-btn">
              {saved ? <Check size={18} /> : null}
              <span>{saved ? 'Configuration Saved ✓' : 'Save System Settings'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
