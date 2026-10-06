import React, { useState } from 'react';
import SoulEmblem from '../common/SoulEmblem';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  MessageCircle,
  Users,
  User,
  Settings,
  Bookmark,
  FileCode2,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { currentRoute, navigateTo, currentUser } = useApp();
  const [activeBloom, setActiveBloom] = useState(null); // 'profile' | null

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'moments', label: 'Soul Moments', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: '3' },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleItemClick = (id) => {
    if (id === 'profile') {
      setActiveBloom(id);
      setTimeout(() => setActiveBloom(null), 350);
    }
    if (id === 'community') {
      navigateTo('home');
    } else {
      navigateTo(id);
    }
  };

  const handleUserFooterClick = () => {
    setActiveBloom('profile');
    setTimeout(() => setActiveBloom(null), 350);
    navigateTo('profile');
  };

  return (
    <aside className="liquid-glass-panel app-sidebar" role="navigation" aria-label="Main Navigation">
      {/* Brand Icon Section */}
      <div>
        <div
          id="nav-brand"
          className="sidebar-brand"
          onClick={() => navigateTo('home')}
          aria-label="Soul Sync Home"
          tabIndex={0}
        >
          <span className="nav-light-glow" aria-hidden="true" />
          <SoulEmblem size={36} />
          <span className="nav-label-pill brand-label-pill">Soul Sync</span>
        </div>

        {/* Navigation Item List */}
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            const isProfileBloom = activeBloom === 'profile' && item.id === 'profile';

            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''} ${
                    isProfileBloom ? 'profile-bloom-active' : ''
                  }`}
                  onClick={() => handleItemClick(item.id)}
                  id={`nav-${item.id}`}
                  aria-label={item.label}
                >
                  <span className="nav-light-glow" aria-hidden="true" />
                  <span className="nav-glass-sheen" aria-hidden="true" />
                  <Icon
                    size={20}
                    color="currentColor"
                    className="nav-icon-svg"
                  />

                  {/* Profile Unique Subtle Liquid Bloom */}
                  {isProfileBloom && (
                    <div className="profile-liquid-bloom-wrapper" aria-hidden="true">
                      <div className="profile-fluid-droplet-core" />
                      <div className="profile-fluid-light-wave" />
                    </div>
                  )}

                  {item.badge && <span className="nav-badge-collapsed">{item.badge}</span>}
                  <span className="nav-label-pill">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Swagger Docs & User Profile Footer */}
      <div>
        {/* Swagger Quick Link */}
        <a
          href="/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item-btn"
          style={{ marginBottom: '0.85rem' }}
          aria-label="Swagger API Documentation"
        >
          <span className="nav-light-glow" aria-hidden="true" />
          <span className="nav-glass-sheen" aria-hidden="true" />
          <FileCode2 size={20} color="currentColor" className="nav-icon-svg swagger-icon" />
          <span className="nav-label-pill">Swagger API</span>
        </a>

        {/* User Card */}
        <div
          id="nav-user-footer"
          className={`sidebar-user-footer ${activeBloom === 'profile' ? 'profile-bloom-active' : ''}`}
          onClick={handleUserFooterClick}
          aria-label="View Profile"
          tabIndex={0}
        >
          <span className="nav-light-glow" aria-hidden="true" />
          <img
            src={
              currentUser?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt="User avatar"
            className="user-avatar-mini"
          />
          {activeBloom === 'profile' && (
            <div className="profile-liquid-bloom-wrapper" aria-hidden="true">
              <div className="profile-fluid-droplet-core" />
              <div className="profile-fluid-light-wave" />
            </div>
          )}
          <div className="nav-label-pill user-label-pill">
            <div style={{ fontWeight: 600, color: '#F5F3F7', fontSize: '0.84rem' }}>
              {currentUser?.name || 'Christon'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#A9ADBC' }}>
              @{currentUser?.username || 'christon'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
