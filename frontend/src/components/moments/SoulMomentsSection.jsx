import React from 'react';
import { useApp } from '../../context/AppContext';
import SoulMomentCard from './SoulMomentCard';
import SoulMomentEmptyState from './SoulMomentEmptyState';
import { Sparkles, ChevronRight, Clock } from 'lucide-react';

const SoulMomentsSection = () => {
  const { soulMomentsPreview, navigateTo } = useApp();

  return (
    <section className="liquid-glass-panel soul-moments-section" aria-label="Soul Moments">
      {/* Header Bar */}
      <div className="soul-moments-header">
        <div className="soul-moments-title-wrap">
          <div className="soul-moments-title-icon">
            <Sparkles size={16} color="#B98CFF" />
          </div>
          <div>
            <h3 className="soul-moments-heading">✨ Soul Moments</h3>
            <p className="soul-moments-subheading">Moments worth remembering.</p>
          </div>
        </div>

        <button
          className="soul-moments-view-all-btn"
          onClick={() => navigateTo('moments')}
          aria-label="View All Soul Moments"
        >
          <span>View All Moments</span>
          <ChevronRight size={14} className="soul-moments-chevron" />
        </button>
      </div>

      {/* Horizontal Memory Cards Preview */}
      {soulMomentsPreview && soulMomentsPreview.length > 0 ? (
        <div className="soul-moments-carousel">
          {soulMomentsPreview.map((moment) => (
            <SoulMomentCard key={moment.id} moment={moment} isCompact={true} />
          ))}
        </div>
      ) : (
        <SoulMomentEmptyState />
      )}
    </section>
  );
};

export default SoulMomentsSection;
