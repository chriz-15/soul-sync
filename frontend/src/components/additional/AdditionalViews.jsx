import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bookmark,
  Archive,
  AlertTriangle,
  Compass,
  X,
  Grid,
  Film,
  Folder
} from 'lucide-react';

export const SavedView = () => {
  const { savedPosts, navigateTo, showToast } = useApp();
  const [tab, setTab] = useState('All');

  const tabs = ['All', 'Posts', 'Reels', 'Collections'];

  return (
    <div className="liquid-glass-panel" style={{ padding: '2rem', width: '100%' }}>
      {/* Header & Tabs (Screen 12 Saved section) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Bookmark size={22} color="#B98CFF" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F3F7' }}>Saved</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? 'btn-primary-gradient' : 'btn-secondary-glass'}
              onClick={() => setTab(t)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 1rem', height: 'auto' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {savedPosts && savedPosts.length > 0 ? (
        <div className="profile-media-grid">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              className="liquid-glass-card"
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => showToast(`Viewing saved post by ${post.author_name}`)}
            >
              <img
                src={post.media_url}
                alt={post.caption}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
              />
              <div style={{ padding: '0.75rem', fontSize: '0.82rem', color: '#A9ADBC' }}>
                <span style={{ fontWeight: 600, color: '#F5F3F7' }}>{post.author_name}</span>: {post.caption?.slice(0, 38)}...
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
          <Bookmark size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F5F3F7', marginBottom: '0.45rem' }}>
            Nothing here yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Looks like you haven't saved anything yet.
          </p>
          <button className="btn-primary-gradient" onClick={() => navigateTo('explore')}>
            <Compass size={16} />
            <span>Explore</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const ArchiveView = () => {
  const { navigateTo } = useApp();

  return (
    <div className="liquid-glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(245, 243, 247, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}
      >
        <Archive size={32} color="var(--text-muted)" />
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.5rem' }}>
        No archives yet
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        Only you can see the posts and stories you archive.<br />
        Hide memories from your profile without permanently deleting them.
      </p>

      <button className="btn-secondary-glass" onClick={() => navigateTo('home')}>
        Back to Feed
      </button>
    </div>
  );
};

export const ReportModal = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 14, 28, 0.8)',
        backdropFilter: 'blur(16px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="liquid-glass-panel"
        style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="#f87171" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F5F3F7' }}>Report</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Help us keep the Soul Sync collective safe and aligned. Why are you reporting this?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {[
            'Report this post (Inappropriate content)',
            'Report user (Impersonation or spam)',
            'Report a technical glitch'
          ].map((opt) => (
            <button
              key={opt}
              className="btn-secondary-glass"
              style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', fontSize: '0.86rem', textAlign: 'left' }}
              onClick={() => {
                showToast('Thank you. Report received for community review.');
                onClose();
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          className="btn-secondary-glass"
          onClick={onClose}
          style={{ width: '100%', padding: '0.75rem' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
