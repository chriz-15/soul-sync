import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  MapPin,
  Users,
  Sliders,
  Send,
  Sparkles,
  X
} from 'lucide-react';

const CreateView = () => {
  const { handleCreatePost, showToast, currentUser, navigateTo } = useApp();
  const [createType, setCreateType] = useState('post'); // 'post' | 'story' | 'reel'
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Varkala Cliff, Kerala');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);

  const samplePresets = [
    { label: 'Sunset Cliff', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Neon Rain', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80' }
  ];

  const handleBackToHome = () => {
    navigateTo('home');
  };

  const onPublish = async () => {
    if (!mediaUrl) {
      showToast('Please select or upload media');
      return;
    }
    setLoading(true);
    await handleCreatePost({
      caption: caption || 'Golden sunset vibes on Soul Sync ✨',
      media_url: mediaUrl,
      location,
      type: createType
    });
    setLoading(false);
  };

  return (
    <div className="liquid-experience-panel" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Ambient background glows */}
      <div className="liquid-panel-glow" aria-hidden="true" />
      <div className="liquid-panel-glow-left" aria-hidden="true" />

      {/* Top Fluid Navigation Bar (Close Button) */}
      <div className="liquid-page-topbar">
        <button
          type="button"
          className="liquid-close-btn"
          onClick={handleBackToHome}
          aria-label="Close"
          title="Return to Home"
          id="btn-close-new-moment"
        >
          <X size={15} strokeWidth={2.4} />
        </button>
      </div>

      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F3F7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>New Moment</span>
            <Sparkles size={18} color="#D4427E" />
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#A9ADBC', marginTop: '0.2rem' }}>
            Broadcast your authentic frequency to the Soul Sync constellation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {['post', 'story', 'reel'].map((t) => (
            <button
              key={t}
              className={createType === t ? 'btn-primary-gradient' : 'btn-secondary-glass'}
              onClick={() => setCreateType(t)}
              style={{
                textTransform: 'capitalize',
                fontSize: '0.84rem',
                padding: '0.45rem 1.25rem',
                height: 'auto'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Left: Upload Dropzone & Controls */}
        <div>
          <div
            className="upload-dropzone"
            onClick={() => showToast('Image file picker simulated - preset selected')}
          >
            <UploadCloud size={48} color="#B98CFF" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F5F3F7', marginBottom: '0.4rem' }}>
              Drag & drop photos or videos
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              or <span style={{ color: '#D4427E', textDecoration: 'underline' }}>Click to upload</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Quick Presets:
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  className="btn-secondary-glass"
                  onClick={() => setMediaUrl(preset.url)}
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.85rem',
                    borderColor: mediaUrl === preset.url ? '#D4427E' : 'rgba(185, 140, 255, 0.18)',
                    color: mediaUrl === preset.url ? '#FFFFFF' : 'inherit',
                    background: mediaUrl === preset.url ? 'rgba(212, 66, 126, 0.2)' : undefined
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Area */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#A9ADBC', marginBottom: '0.5rem' }}>
              Caption
            </label>
            <textarea
              className="glass-input-field"
              rows={4}
              placeholder="Add a caption... Share your frequency with the world."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ resize: 'none', lineHeight: 1.5 }}
            />
          </div>

          {/* Extra options: Location & Tag */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary-glass"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              onClick={() => showToast('Location set: Varkala Cliff, Kerala')}
            >
              <MapPin size={15} color="#79D9FF" />
              <span>Add Location</span>
            </button>

            <button
              className="btn-secondary-glass"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              onClick={() => showToast('Tag friends modal')}
            >
              <Users size={15} color="#B98CFF" />
              <span>Tag People</span>
            </button>

            <button
              className="btn-secondary-glass"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
              onClick={() => showToast('Advanced options opened')}
            >
              <Sliders size={15} color="#D4427E" />
              <span>More Options</span>
            </button>
          </div>
        </div>

        {/* Right: Live Preview Card */}
        <div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Live Resonance Preview
          </div>

          <div className="liquid-glass-card" style={{ padding: '1rem', border: '1px solid rgba(185, 140, 255, 0.22)' }}>
            <div style={{ width: '100%', height: '240px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem', background: '#000', boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}>
              <img
                src={mediaUrl}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ fontSize: '0.88rem', color: '#F5F3F7', fontWeight: 600, marginBottom: '0.3rem' }}>
              {currentUser?.name || 'Christon Thomas'}
            </div>

            <div style={{ fontSize: '0.84rem', color: '#A9ADBC', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              {caption || 'Add your thoughts... Captions appear here in real-time.'}
            </div>

            <button
              className="btn-primary-gradient"
              onClick={onPublish}
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Send size={16} />
              <span>{loading ? 'Sharing to Soul Sync...' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateView;
