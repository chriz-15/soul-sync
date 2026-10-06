import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import SoulMomentCard from './SoulMomentCard';
import SoulMomentEmptyState from './SoulMomentEmptyState';
import CategoryMemoryExperience from './CategoryMemoryExperience';
import {
  ArrowLeft,
  Sparkles,
  Search,
  Plus,
  Calendar,
  Clock,
  Award,
  Layers,
  Check,
  FolderPlus,
  Compass,
  MapPin,
  Users
} from 'lucide-react';

const SoulMomentTimeline = () => {
  const {
    soulMoments,
    momentCollections,
    handleCreateCollection,
    navigateTo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState('all');
  const [activeViewTab, setActiveViewTab] = useState('curated'); // 'curated' | 'timeline'
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [newCollName, setNewCollName] = useState('');
  const [newCollIcon, setNewCollIcon] = useState('✨');
  const [activeCategoryExperience, setActiveCategoryExperience] = useState(null);

  // Category detection for the four upgraded collection experiences
  const getCategoryKey = (c) => {
    const name = (c.name || '').toLowerCase();
    if (name.includes('travel') || c.id === 1) return 'travel';
    if (name.includes('favorite') || c.id === 2) return 'favorite';
    if (name.includes('special') || c.id === 3) return 'special';
    if (name.includes('college') || c.id === 4) return 'college';
    return null;
  };

  const formatCollectionLabel = (c) => {
    if (!c.name) return '';
    if (c.icon && c.name.startsWith(c.icon)) {
      return c.name;
    }
    return c.icon ? `${c.icon} ${c.name}` : c.name;
  };

  // Search & Collection Filtering
  const filteredMoments = useMemo(() => {
    return soulMoments.filter((m) => {
      // Collection filter
      if (activeCollectionId !== 'all' && m.collection_id !== activeCollectionId) {
        return false;
      }

      // Search query filter (matches title, caption, location, people_involved, date, private_note)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (m.title || '').toLowerCase().includes(q);
        const captionMatch = (m.caption || '').toLowerCase().includes(q);
        const locationMatch = (m.location || '').toLowerCase().includes(q);
        const peopleMatch = (m.people_involved || '').toLowerCase().includes(q);
        const dateMatch = (m.memory_date || '').toLowerCase().includes(q);
        const noteMatch = (m.private_note || '').toLowerCase().includes(q);
        if (!titleMatch && !captionMatch && !locationMatch && !peopleMatch && !dateMatch && !noteMatch) {
          return false;
        }
      }

      return true;
    });
  }, [soulMoments, activeCollectionId, searchQuery]);

  // Section A: On This Day memories
  const onThisDayMemories = useMemo(() => {
    return filteredMoments.filter((m) => m.memory_type === 'on_this_day');
  }, [filteredMoments]);

  // Section B: Recent Memories (saved / added recently)
  const recentMemories = useMemo(() => {
    return filteredMoments.filter(
      (m) => m.memory_type === 'saved' || (m.years_ago !== undefined && m.years_ago <= 1 && m.memory_type !== 'on_this_day')
    );
  }, [filteredMoments]);

  // Section C: Milestone Moments (achievements, special trips, birthdays, graduation)
  const milestoneMemories = useMemo(() => {
    return filteredMoments.filter(
      (m) => m.memory_type === 'milestone' || m.collection_id === 4 || m.collection_id === 5
    );
  }, [filteredMoments]);

  // Section D: Chronological Timeline Breakdown (Year -> Month -> Date)
  const timelineByYear = useMemo(() => {
    const map = {};
    filteredMoments.forEach((m) => {
      const year = m.memory_date ? new Date(m.memory_date).getFullYear() : 'Undated';
      if (!map[year]) map[year] = [];
      map[year].push(m);
    });
    // Sort descending
    return Object.entries(map).sort(([y1], [y2]) => y2 - y1);
  }, [filteredMoments]);

  const handleAddNewCollection = async (e) => {
    e.preventDefault();
    if (newCollName.trim()) {
      await handleCreateCollection(newCollName.trim(), newCollIcon);
      setNewCollName('');
      setShowAddCollection(false);
    }
  };

  return (
    <>
      <div className={`soul-timeline-page ${activeCategoryExperience ? 'soul-timeline-blurred-bg' : ''}`}>
      {/* 1. Top Header Panel */}
      <div className="soul-timeline-header-panel liquid-glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <button
            className="btn-secondary-glass soul-timeline-back-btn"
            onClick={() => navigateTo('home')}
            aria-label="Back to Home Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="soul-timeline-stat-pill">
            <Sparkles size={13} color="#B98CFF" />
            <span>{soulMoments.length} Preserved Moments</span>
          </div>
        </div>

        <div className="soul-timeline-hero-title-wrap">
          <div className="soul-timeline-badge-glow">
            <Sparkles size={22} color="#B98CFF" />
          </div>
          <div>
            <h1 className="soul-timeline-main-title">✨ Soul Moments</h1>
            <p className="soul-timeline-sub-text">
              Moments worth remembering • A private memory layer of your journey
            </p>
          </div>
        </div>

        {/* Section F: Search Memories Experience */}
        <div className="soul-timeline-search-row">
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search memories by title, person, place, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input-field soul-timeline-search-input"
            />
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#A9ADBC'
              }}
            />
            {searchQuery && (
              <button
                className="soul-timeline-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section E: Collections Filter Pills */}
        <div className="soul-timeline-collections-bar">
          <button
            className={`soul-collection-tab ${activeCollectionId === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCollectionId('all')}
          >
            <span>All Moments</span>
            <span className="soul-collection-badge">{soulMoments.length}</span>
          </button>

          {momentCollections.map((c) => {
            const catKey = getCategoryKey(c);
            const isCategoryActive = activeCategoryExperience?.key === catKey;

            return (
              <button
                key={c.id}
                className={`soul-collection-tab ${
                  activeCollectionId === c.id || isCategoryActive ? 'active' : ''
                } ${catKey ? 'category-experience-pill' : ''}`}
                onClick={(e) => {
                  if (catKey) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const viewportW = window.innerWidth;
                    const viewportH = window.innerHeight;
                    const flowDx = Math.max(-140, Math.min(140, (centerX - viewportW / 2) * 0.45));
                    const flowDy = Math.max(-180, (centerY - viewportH / 2) * 0.7);

                    setActiveCategoryExperience({
                      key: catKey,
                      collection: c,
                      originRect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        centerX,
                        centerY,
                        flowDx,
                        flowDy
                      }
                    });
                  } else {
                    setActiveCollectionId(c.id);
                  }
                }}
              >
                <span>{formatCollectionLabel(c)}</span>
              </button>
            );
          })}

          {/* "+ Create Collection" Custom Creator */}
          {!showAddCollection ? (
            <button
              className="soul-collection-tab add-tab"
              onClick={() => setShowAddCollection(true)}
              title="Create custom collection"
            >
              <Plus size={13} />
              <span>Create Collection</span>
            </button>
          ) : (
            <form onSubmit={handleAddNewCollection} className="soul-add-collection-inline-form">
              <input
                type="text"
                placeholder="Collection name..."
                value={newCollName}
                onChange={(e) => setNewCollName(e.target.value)}
                className="soul-add-coll-input"
                autoFocus
              />
              <select
                value={newCollIcon}
                onChange={(e) => setNewCollIcon(e.target.value)}
                className="soul-add-coll-icon-select"
              >
                <option value="✨">✨</option>
                <option value="❤️">❤️</option>
                <option value="✈️">✈️</option>
                <option value="🎓">🎓</option>
                <option value="🎂">🎂</option>
                <option value="🫶">🫶</option>
                <option value="🌅">🌅</option>
              </select>
              <button type="submit" className="btn-primary-gradient" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                <Check size={12} />
              </button>
              <button
                type="button"
                className="btn-secondary-glass"
                onClick={() => setShowAddCollection(false)}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            </form>
          )}
        </div>

        {/* View Mode Switcher: Curated Moments vs Chronological Timeline */}
        <div className="soul-timeline-view-switcher">
          <button
            className={`soul-view-switch-btn ${activeViewTab === 'curated' ? 'active' : ''}`}
            onClick={() => setActiveViewTab('curated')}
          >
            <Sparkles size={14} />
            <span>Curated Moments</span>
          </button>
          <button
            className={`soul-view-switch-btn ${activeViewTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveViewTab('timeline')}
          >
            <Clock size={14} />
            <span>Chronological Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      {filteredMoments.length === 0 ? (
        <div style={{ marginTop: '1rem' }}>
          <SoulMomentEmptyState />
        </div>
      ) : activeViewTab === 'curated' ? (
        <div className="soul-timeline-groups-container">
          {/* Section A: ON THIS DAY */}
          {onThisDayMemories.length > 0 && (
            <section className="soul-timeline-group" aria-label="On This Day Memories">
              <div className="soul-timeline-group-header">
                <div className="soul-timeline-group-dot on-this-day-dot" />
                <h3 className="soul-timeline-group-title">✨ On This Day</h3>
                <span className="soul-timeline-group-sub">
                  Rediscover what you felt and experienced on this date in past years
                </span>
              </div>

              <div className="soul-timeline-grid">
                {onThisDayMemories.map((m) => (
                  <SoulMomentCard key={m.id} moment={m} />
                ))}
              </div>
            </section>
          )}

          {/* Section B: RECENT MEMORIES */}
          {recentMemories.length > 0 && (
            <section className="soul-timeline-group" aria-label="Recent Soul Moments">
              <div className="soul-timeline-group-header">
                <div className="soul-timeline-group-dot" />
                <h3 className="soul-timeline-group-title">🌟 Recent Memories</h3>
                <span className="soul-timeline-group-sub">
                  Recently saved and shared memories from your journey
                </span>
              </div>

              <div className="soul-timeline-grid">
                {recentMemories.map((m) => (
                  <SoulMomentCard key={m.id} moment={m} />
                ))}
              </div>
            </section>
          )}

          {/* Section C: MILESTONE MOMENTS */}
          {milestoneMemories.length > 0 && (
            <section className="soul-timeline-group" aria-label="Milestone Moments">
              <div className="soul-timeline-group-header">
                <div className="soul-timeline-group-dot milestone-dot" />
                <h3 className="soul-timeline-group-title">🏆 Milestone Moments</h3>
                <span className="soul-timeline-group-sub">
                  Special achievements, memorable trips, celebrations, and personal milestones
                </span>
              </div>

              <div className="soul-timeline-grid">
                {milestoneMemories.map((m) => (
                  <SoulMomentCard key={m.id} moment={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Section D: MEMORY TIMELINE (Year -> Month -> Date) */
        <div className="soul-timeline-groups-container">
          {timelineByYear.map(([year, momentsInYear]) => (
            <section key={year} className="soul-timeline-group" aria-label={`Memories from ${year}`}>
              <div className="soul-timeline-group-header">
                <div className="soul-timeline-group-dot" />
                <h3 className="soul-timeline-group-title">🗓️ Year {year}</h3>
                <span className="soul-timeline-group-sub">
                  {momentsInYear.length} {momentsInYear.length === 1 ? 'memory' : 'memories'} preserved
                </span>
              </div>

              <div className="soul-timeline-grid">
                {momentsInYear.map((m) => (
                  <SoulMomentCard key={m.id} moment={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>

      {/* Complete Category Memory Experience Overlay */}
      {activeCategoryExperience && (
        <CategoryMemoryExperience
          categoryKey={activeCategoryExperience.key}
          originRect={activeCategoryExperience.originRect}
          onClose={() => setActiveCategoryExperience(null)}
        />
      )}
    </>
  );
};

export default SoulMomentTimeline;
