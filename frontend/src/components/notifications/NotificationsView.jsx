import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  X,
  Bell,
  Sparkles
} from 'lucide-react';

const NotificationsView = () => {
  const { notifications, showToast, navigateTo } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [followedUsers, setFollowedUsers] = useState({});

  const tabs = ['All', 'Likes', 'Comments', 'Follows', 'Mentions'];

  const handleBackToHome = () => {
    navigateTo('home');
  };

  const toggleFollow = (actorId) => {
    setFollowedUsers((prev) => {
      const nextState = !prev[actorId];
      showToast(nextState ? 'Followed back' : 'Unfollowed');
      return { ...prev, [actorId]: nextState };
    });
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Likes' && n.type === 'like') return true;
    if (activeFilter === 'Comments' && n.type === 'comment') return true;
    if (activeFilter === 'Follows' && n.type === 'follow') return true;
    if (activeFilter === 'Mentions' && n.type === 'mention') return true;
    return false;
  });

  return (
    <div className="liquid-experience-panel" style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
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
          id="btn-close-notif"
        >
          <X size={15} strokeWidth={2.4} />
        </button>
      </div>

      {/* Header & Tabs */}
      <div style={{ marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F3F7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Notifications</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(212, 66, 126, 0.22)',
                  color: '#D4427E',
                  border: '1px solid rgba(212, 66, 126, 0.4)'
                }}
              >
                {filteredNotifs.length} new
              </span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#A9ADBC', marginTop: '0.2rem' }}>
              Real-time synchronicity and social resonance updates
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeFilter === tab ? 'btn-primary-gradient' : 'btn-secondary-glass'}
              onClick={() => setActiveFilter(tab)}
              style={{
                fontSize: '0.82rem',
                padding: '0.4rem 1.15rem',
                height: 'auto'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
        {filteredNotifs.map((n) => {
          const isFollowing = followedUsers[n.actor_id];
          return (
            <div
              key={n.id}
              className="liquid-glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.95rem 1.25rem',
                gap: '1rem',
                transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                border: '1px solid rgba(185, 140, 255, 0.16)'
              }}
            >
              {/* Actor avatar & notification icon badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={n.actor_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                    alt={n.actor_name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(185, 140, 255, 0.25)' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: n.type === 'like' ? '#D4427E' : n.type === 'comment' ? '#B98CFF' : '#79D9FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #0A0E1C',
                      boxShadow: '0 0 8px rgba(185, 140, 255, 0.4)'
                    }}
                  >
                    {n.type === 'like' && <Heart size={10} color="#ffffff" fill="#ffffff" />}
                    {n.type === 'comment' && <MessageCircle size={10} color="#ffffff" />}
                    {n.type === 'follow' && <UserPlus size={10} color="#ffffff" />}
                    {n.type === 'mention' && <AtSign size={10} color="#ffffff" />}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.88rem', color: '#A9ADBC', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600, color: '#F5F3F7', marginRight: '0.35rem' }}>
                      {n.actor_name}
                    </span>
                    {n.text.replace(n.actor_name, '')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    2h ago
                  </div>
                </div>
              </div>

              {/* Trailing action: Follow back button or thumbnail */}
              <div>
                {n.type === 'follow' ? (
                  <button
                    className={isFollowing ? 'btn-secondary-glass' : 'btn-primary-gradient'}
                    onClick={() => toggleFollow(n.actor_id)}
                    style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                ) : n.target_media_url ? (
                  <img
                    src={n.target_media_url}
                    alt="Post thumbnail"
                    style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(185, 140, 255, 0.2)' }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsView;
