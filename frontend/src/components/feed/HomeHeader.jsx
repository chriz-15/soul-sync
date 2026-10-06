import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Plus,
  Bell,
  Sparkles,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import SoulEmblem from '../common/SoulEmblem';

const HomeHeader = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filterCounts = {}
}) => {
  const {
    currentUser,
    notifications,
    navigateTo
  } = useApp();

  const searchInputRef = useRef(null);

  const unreadNotifsCount = notifications?.filter((n) => !n.is_read)?.length || 3;

  const filterTabs = [
    { id: 'all', label: 'All Streams', count: filterCounts.all || 0 },
    { id: 'cinematic', label: 'Cinematic', count: filterCounts.cinematic || 0 },
    { id: 'memories', label: 'Memories', count: filterCounts.memories || 0 },
    { id: 'feelings', label: 'Frequencies', count: filterCounts.feelings || 0 },
    { id: 'quotes', label: 'Reflections', count: filterCounts.quotes || 0 }
  ];

  return (
    <header className="soul-home-header" role="banner">
      {/* 1. Brand & Synchronicity Indicator */}
      <div className="soul-header-brand-wrap">
        <div className="soul-header-title-block">
          <div className="soul-header-title">
            <span>Soul Stream</span>
            <Sparkles size={16} color="#B98CFF" />
          </div>
          <div className="soul-header-subtitle">
            <span className="soul-pulse-dot" />
            <span>Harmonized & Live</span>
          </div>
        </div>
      </div>

      {/* 2. Liquid Glass Search Soul Sync */}
      <div className="soul-search-wrap">
        <Search size={16} strokeWidth={2.2} className="soul-search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="soul-search-input"
          placeholder="Search Soul Sync — memories, people, frequencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            className="soul-search-clear-btn"
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="soul-search-logo-badge" title="Soul Sync" aria-hidden="true">
            <SoulEmblem size={20} />
          </div>
        )}
      </div>

      {/* 3. Header Action Utilities */}
      <div className="soul-header-actions">
        {/* Create / Share Moment */}
        <button
          className="soul-header-btn primary"
          onClick={() => navigateTo('create')}
          title="Share a new Moment or Reflection"
        >
          <Plus size={15} strokeWidth={2.6} />
          <span>New Moment</span>
        </button>

        {/* Notifications Quick Icon */}
        <button
          className="soul-header-btn"
          style={{ width: '40px', padding: 0, position: 'relative' }}
          onClick={() => navigateTo('notifications')}
          title="View Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} color="currentColor" />
          {unreadNotifsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#D4427E',
                boxShadow: '0 0 8px #D4427E'
              }}
            />
          )}
        </button>

        {/* Current User Quick Chip */}
        <div
          className="soul-header-user-chip"
          onClick={() => navigateTo('profile')}
          title="Go to Your Soul Profile"
        >
          <img
            src={
              currentUser?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt="Current User"
            className="soul-header-user-avatar"
          />
          <span className="soul-header-user-name">
            {currentUser?.name?.split(' ')[0] || 'Christon'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
