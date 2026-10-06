import React from 'react';
import { Sparkles, HeartHandshake } from 'lucide-react';

const SoulMomentEmptyState = () => {
  return (
    <div className="soul-moment-empty-state">
      <div className="soul-moment-empty-icon-wrap">
        <Sparkles size={24} color="#B98CFF" />
      </div>
      <h4 className="soul-moment-empty-title">Your story is just beginning.</h4>
      <p className="soul-moment-empty-desc">
        Your meaningful moments, connection milestones, and "On This Day" memories will appear here as you create them.
      </p>
    </div>
  );
};

export default SoulMomentEmptyState;
