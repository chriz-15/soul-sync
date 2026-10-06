import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import HomeHeader from './HomeHeader';
import SoulMomentsBar from './SoulMomentsBar';
import SoulPostCard from './SoulPostCard';
import SoulRadar from './SoulRadar';
import LiveFrequencies from './LiveFrequencies';
import DiscoverSection from './DiscoverSection';
import './liquidFeed.css';
import { Sparkles, Compass, Search, RotateCcw } from 'lucide-react';

const HomeFeed = () => {
  const { feedPosts, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Compute composition tag for each post
  const getPostType = (post) => {
    if (post.composition) return post.composition;
    if (post.id === 1 || post.caption?.toLowerCase().includes('sunset') || post.caption?.toLowerCase().includes('poetry')) {
      return 'cinematic';
    }
    if (post.id === 2 || post.caption?.toLowerCase().includes('silence') || post.caption?.includes('"')) {
      return 'quotes';
    }
    if (post.id === 3 || post.caption?.toLowerCase().includes('waves') || post.caption?.toLowerCase().includes('tide')) {
      return 'memories';
    }
    if (post.id === 4 || post.caption?.toLowerCase().includes('neon') || post.caption?.toLowerCase().includes('liquid glass')) {
      return 'feelings';
    }
    return 'cinematic';
  };

  // Filter posts based on activeFilter and searchQuery
  const filteredPosts = useMemo(() => {
    return feedPosts.filter((post) => {
      // 1. Category Filter
      if (activeFilter !== 'all') {
        const type = getPostType(post);
        if (type !== activeFilter) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCaption = post.caption?.toLowerCase().includes(q);
        const matchesAuthor = post.author_name?.toLowerCase().includes(q) || post.author_username?.toLowerCase().includes(q);
        const matchesLocation = post.location?.toLowerCase().includes(q);
        const matchesComments = post.comments?.some((c) => c.text?.toLowerCase().includes(q) || c.username?.toLowerCase().includes(q));
        if (!matchesCaption && !matchesAuthor && !matchesLocation && !matchesComments) {
          return false;
        }
      }

      return true;
    });
  }, [feedPosts, activeFilter, searchQuery]);

  // Compute counts for filter pills
  const filterCounts = useMemo(() => {
    const counts = { all: feedPosts.length, cinematic: 0, memories: 0, feelings: 0, quotes: 0 };
    feedPosts.forEach((p) => {
      const type = getPostType(p);
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });
    return counts;
  }, [feedPosts]);

  return (
    <div className="soul-feed-stage">
      {/* 1. Top Liquid Glass Header with Search & Quick Utilities */}
      <HomeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filterCounts={filterCounts}
      />

      {/* 2. Main Split Stage: Soul Stream + Soul Radar */}
      <div className="soul-feed-columns">
        {/* Central Soul Stream Area */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Soul Moments: Vertical Memory Cards Carousel */}
          <SoulMomentsBar />

          {/* Active Search Banner if filtering */}
          {searchQuery && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1rem',
                borderRadius: '16px',
                background: 'rgba(184, 50, 104, 0.12)',
                border: '1px solid rgba(185, 140, 255, 0.22)',
                fontSize: '0.82rem',
                color: '#F5F3F7'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={14} color="#79D9FF" />
                <span>
                  Filtering by{' '}
                  <strong style={{ color: '#B98CFF' }}>
                    "{searchQuery}"
                  </strong>{' '}
                  ({filteredPosts.length} results)
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#79D9FF',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <RotateCcw size={12} />
                <span>Reset Stream</span>
              </button>
            </div>
          )}

          {/* Feed Posts List */}
          {filteredPosts.length > 0 ? (
            <div className="soul-stream-feed">
              {filteredPosts.map((post) => (
                <SoulPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div
              className="soul-post-card"
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <Sparkles size={36} color="#B98CFF" />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.4rem' }}>
                  No moments found on this frequency
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
                  Try adjusting your search terms or switch filter categories to reconnect with the stream.
                </p>
              </div>
              <button
                className="btn-secondary-glass"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                style={{ marginTop: '0.5rem' }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Soul Radar & Discovery Column */}
        <aside className="soul-radar-column" aria-label="Soul Radar and Live Frequencies">
          {/* 1. Soul Radar (People connection & suggested profiles) */}
          <SoulRadar searchQuery={searchQuery} />

          {/* 2. Live Frequencies (Trending conversations & vibe telemetry) */}
          <LiveFrequencies onSelectFrequency={(tag) => setSearchQuery(tag)} />

          {/* 3. Discover (Places, Moods, Communities) & Motto */}
          <DiscoverSection onSelectCategory={(q) => setSearchQuery(q)} />
        </aside>
      </div>
    </div>
  );
};

export default HomeFeed;
