import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const SoulMomentCard = ({ moment, isCompact = false }) => {
  const { setActiveMomentDetail } = useApp();

  const getBadgeLabel = () => {
    if (moment.memory_type === 'on_this_day') {
      return moment.years_ago === 1 ? '1 year ago today' : `${moment.years_ago || 2} years ago today`;
    }
    if (moment.memory_type === 'milestone') return 'Milestone Moment';
    if (moment.memory_type === 'saved') return 'Saved Memory';
    return 'Soul Moment';
  };

  const formattedDate = () => {
    if (!moment.memory_date) return '';
    try {
      const d = new Date(moment.memory_date);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return moment.memory_date;
    }
  };

  const photos = (() => {
    if (!moment.media_url) return [];
    if (Array.isArray(moment.media_url)) return moment.media_url;
    if (typeof moment.media_url === 'string' && moment.media_url.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(moment.media_url);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [moment.media_url];
  })();

  const primaryPhoto = photos[0] || moment.media_url;

  return (
    <div
      className="soul-moment-preview-card"
      onClick={() => setActiveMomentDetail(moment)}
      role="button"
      tabIndex={0}
      title="View Memory Details"
    >
      {/* Thumbnail Container */}
      <div className="soul-moment-thumb-wrap">
        <img
          src={primaryPhoto}
          alt={moment.title || 'Soul Moment'}
          className="soul-moment-thumb-img"
          loading="lazy"
        />
        <div className="soul-moment-thumb-overlay" />

        {/* Multi-Photo Count Badge */}
        {photos.length > 1 && (
          <div className="soul-moment-multi-badge">
            <span>📷 {photos.length} photos</span>
          </div>
        )}

        {/* Floating Badge (e.g. "1 year ago today") */}
        <div className="soul-moment-type-badge">
          <Sparkles size={11} color="#B98CFF" />
          <span>{getBadgeLabel()}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="soul-moment-content">
        <div className="soul-moment-meta-row">
          <span className="soul-moment-date">
            <Calendar size={12} />
            {formattedDate()}
          </span>
          {moment.location && (
            <span className="soul-moment-location">
              <MapPin size={11} />
              {moment.location.split(',')[0]}
            </span>
          )}
        </div>

        <h4 className="soul-moment-title">{moment.title || 'Special Memory'}</h4>

        <p className="soul-moment-caption-snippet">
          {moment.caption || 'A meaningful moment preserved in your frequency.'}
        </p>

        {moment.people_involved && (
          <div className="soul-moment-people">
            <span style={{ opacity: 0.7 }}>With: </span>
            <span style={{ color: '#B98CFF', fontWeight: 500 }}>{moment.people_involved}</span>
          </div>
        )}

        {/* View Memory Affordance */}
        <div className="soul-moment-action-link">
          <span>View Memory</span>
          <ArrowRight size={13} className="soul-moment-action-arrow" />
        </div>
      </div>
    </div>
  );
};

export default SoulMomentCard;
