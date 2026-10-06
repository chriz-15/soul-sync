import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Sparkles, UserPlus, Check, Zap } from 'lucide-react';
import api from '../../services/api';

const SoulRadar = ({ searchQuery = '' }) => {
  const { suggestedUsers, navigateTo, showToast } = useApp();
  const [followingMap, setFollowingMap] = useState({});

  // Curated resonance metadata for suggested profiles
  const radarMetadata = {
    megha_official: { resonance: '98%', vibe: 'Coastal Photography & Vinyl' },
    arjun_v: { resonance: '94%', vibe: 'Mountain Trails & Ambient' },
    sahana_m: { resonance: '91%', vibe: 'Goa Architecture & Ocean' },
    vikram_r: { resonance: '89%', vibe: 'Acoustic Guitar & Midnight' },
    priya_arts: { resonance: '86%', vibe: 'Liquid Materials & Digital Art' },
    karthik_lens: { resonance: '84%', vibe: 'Untamed Canopy & Wilderness' }
  };

  const fallbackUsers = [
    {
      id: 2,
      name: 'Megha',
      username: 'megha_official',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Arjun',
      username: 'arjun_v',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Sahana',
      username: 'sahana_m',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      name: 'Vikram',
      username: 'vikram_r',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const sourceUsers = suggestedUsers && suggestedUsers.length > 0 ? suggestedUsers : fallbackUsers;

  const filteredUsers = sourceUsers.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      radarMetadata[u.username]?.vibe?.toLowerCase().includes(q)
    );
  });

  const handleToggleFollow = async (user) => {
    const isNowFollowing = !followingMap[user.id];
    setFollowingMap((prev) => ({ ...prev, [user.id]: isNowFollowing }));
    showToast(isNowFollowing ? `Now in sync with ${user.name} ✨` : `Disconnected from ${user.name}`);
    try {
      if (api.followUser) {
        await api.followUser(user.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="soul-radar-panel" aria-label="Soul Radar">
      {/* Header */}
      <div className="soul-radar-header">
        <div className="soul-radar-title-wrap">
          <span className="soul-radar-ping-icon" />
          <h4 className="soul-radar-title">Soul Radar</h4>
        </div>
        <span
          className="soul-radar-action-link"
          onClick={() => navigateTo('explore')}
        >
          Expand Radar
        </span>
      </div>

      {/* Suggested Profiles List */}
      <div className="soul-radar-list">
        {filteredUsers.slice(0, 4).map((user) => {
          const meta = radarMetadata[user.username] || {
            resonance: '88%',
            vibe: 'Shared Visual Aesthetics'
          };
          const isFollowing = followingMap[user.id];

          return (
            <div key={user.id} className="soul-radar-user-card">
              <div
                className="soul-radar-user-info-group"
                onClick={() => navigateTo('profile')}
                title={`View ${user.name}'s profile`}
              >
                <div className="soul-radar-avatar-wrap">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="soul-radar-avatar"
                  />
                  <span className="soul-radar-online-pip" />
                </div>
                <div className="soul-radar-text-block">
                  <span className="soul-radar-name">{user.name}</span>
                  <span className="soul-radar-resonance-pill">
                    <Zap size={11} color="#B98CFF" />
                    <span>{meta.resonance} Resonance</span>
                  </span>
                </div>
              </div>

              <button
                className={`soul-radar-follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => handleToggleFollow(user)}
                title={isFollowing ? 'Following' : 'Connect with soul'}
              >
                {isFollowing ? 'In Sync' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SoulRadar;
