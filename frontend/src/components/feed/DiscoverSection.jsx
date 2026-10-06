import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, MapPin, HeartHandshake, Sparkles, Moon, Sun, Trees } from 'lucide-react';

const DiscoverSection = ({ onSelectCategory }) => {
  const { navigateTo, showToast } = useApp();

  const discoverItems = [
    { type: 'place', label: 'Varkala Cliff', icon: MapPin, query: 'Varkala' },
    { type: 'place', label: 'Munnar Pines', icon: Trees, query: 'Munnar' },
    { type: 'mood', label: 'Ocean Solitude', icon: Moon, query: 'Ocean' },
    { type: 'mood', label: 'Golden Hour Dusk', icon: Sun, query: 'Golden' },
    { type: 'community', label: 'Acoustic Souls', icon: Sparkles, query: 'Acoustic' },
    { type: 'community', label: 'Mountain Walkers', icon: Compass, query: 'Mountain' }
  ];

  const handleChipClick = (item) => {
    if (onSelectCategory) {
      onSelectCategory(item.query);
    }
    showToast(`Exploring ${item.label} in Soul Sync ✨`);
  };

  return (
    <>
      <section className="soul-discover-panel" aria-label="Discover">
        <div className="soul-discover-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Compass size={16} color="#79D9FF" />
            <h4 className="soul-discover-title">Discover</h4>
          </div>
          <span
            style={{ fontSize: '0.74rem', color: '#B98CFF', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigateTo('explore')}
          >
            All Spaces
          </span>
        </div>

        <div className="soul-discover-tags-grid">
          {discoverItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="soul-discover-chip"
                onClick={() => handleChipClick(item)}
                title={`Discover ${item.label}`}
              >
                <Icon size={12} color="#79D9FF" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Soul Synchronicity Motto Card */}
      <div className="soul-sync-card">
        <Sparkles size={18} color="#B98CFF" style={{ margin: '0 auto 0.4rem' }} />
        <div className="soul-sync-card-motto">
          "Different Souls. Same Frequency."
        </div>
        <div className="soul-sync-card-stat">
          ⚡ 94.8% Community Resonance Active
        </div>
      </div>
    </>
  );
};

export default DiscoverSection;
