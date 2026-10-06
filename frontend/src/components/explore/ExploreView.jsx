import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Heart, Sparkles } from 'lucide-react';

const ExploreView = () => {
  const { exploreItems, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['For You', 'People', 'Places', 'Tags'];

  const filteredItems = exploreItems.filter((item) => {
    const matchesCat = selectedCategory === 'For You' || item.category === selectedCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Header & Search Bar (Screen 09 representation) */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ position: 'relative', maxWidth: '600px', marginBottom: '1.25rem' }}>
          <input
            type="text"
            className="glass-input-field"
            placeholder="Search anything... places, souls, frequencies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.8rem', padding: '0.85rem 1.1rem 0.85rem 2.8rem', fontSize: '0.94rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'btn-primary-gradient' : 'btn-secondary-glass'}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '0.82rem',
                padding: '0.45rem 1.25rem',
                height: 'auto'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid */}
      <div className="explore-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="explore-card liquid-glass-panel"
            onClick={() => showToast(`Opened "${item.title}" by ${item.user}`)}
          >
            <img src={item.media_url} alt={item.title} />

            <div className="explore-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.2rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#B98CFF' }}>
                    @{item.user}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F5F3F7', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Heart size={14} fill="#B83268" color="#B83268" />
                  <span>{item.likes_count?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;
