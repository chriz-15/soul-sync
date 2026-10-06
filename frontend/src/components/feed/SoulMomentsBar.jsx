import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Sparkles,
  Heart,
  Send,
  X
} from 'lucide-react';

const SoulMomentsBar = () => {
  const { currentUser, navigateTo, showToast } = useApp();
  const trackRef = useRef(null);

  // Active story viewing modal state
  const [activeStory, setActiveStory] = useState(null);
  const [storyLiked, setStoryLiked] = useState(false);
  const [storyReply, setStoryReply] = useState('');

  // Scroll position indicator for SEE ALL button
  const [isScrolledEnd, setIsScrolledEnd] = useState(false);

  // Extended Soul Moments collection (added 3 additional moments for rich variety)
  const momentsData = [
    {
      id: 0,
      name: 'Your Moment',
      authorHandle: '@' + (currentUser?.username || 'christon'),
      avatar:
        currentUser?.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      momentImage:
        currentUser?.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      vibe: 'Add to Stream',
      isSelf: true,
      isViewed: false,
      timestamp: 'Now'
    },
    {
      id: 1,
      name: 'Megha',
      authorHandle: '@megha_official',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      vibe: '🌅 Sunset Solitude',
      isViewed: false,
      timestamp: '2h ago',
      caption: 'The Arabian Sea whispering peace into the evening dusk.'
    },
    {
      id: 2,
      name: 'Arjun',
      authorHandle: '@arjun_v',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
      vibe: '⛰️ Pine Mist Trek',
      isViewed: false,
      timestamp: '3h ago',
      caption: 'Higher elevations, quieter minds. Silence is medicine.'
    },
    {
      id: 3,
      name: 'Sahana',
      authorHandle: '@sahana_m',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
      vibe: '🌊 Ocean Tides',
      isViewed: true,
      timestamp: '5h ago',
      caption: 'Where the waves rewrite our memories with every incoming tide.'
    },
    {
      id: 4,
      name: 'Vikram',
      authorHandle: '@vikram_r',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      vibe: '🎸 Acoustic Moon',
      isViewed: true,
      timestamp: '6h ago',
      caption: 'Strumming chords under midnight fog. Pure resonance.'
    },
    {
      id: 5,
      name: 'Priya',
      authorHandle: '@priya_arts',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      vibe: '✨ Digital Dreaming',
      isViewed: false,
      timestamp: '8h ago',
      caption: 'Exploring liquid glass materials and atmospheric UI art.'
    },
    {
      id: 6,
      name: 'Karthik',
      authorHandle: '@karthik_lens',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
      vibe: '🌿 Deep Wilderness',
      isViewed: true,
      timestamp: '12h ago',
      caption: 'Untamed forest canopy waking up to morning golden rays.'
    },
    {
      id: 7,
      name: 'Tara',
      authorHandle: '@tara_wanders',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      vibe: '🌸 Alpine Flora',
      isViewed: false,
      timestamp: '14h ago',
      caption: 'Alpine flora blooming between rugged mountain rocks.'
    },
    {
      id: 8,
      name: 'Rohan',
      authorHandle: '@rohan_visuals',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      vibe: '🏔️ Glacial Dawn',
      isViewed: false,
      timestamp: '16h ago',
      caption: 'First morning frost over the pristine mountain valley.'
    },
    {
      id: 9,
      name: 'Ananya',
      authorHandle: '@ananya_soul',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      momentImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80',
      vibe: '🕯️ Golden Meadow',
      isViewed: true,
      timestamp: '19h ago',
      caption: 'Warm ambient breeze across the golden evening fields.'
    }
  ];

  // Check scroll position to dynamically update SEE ALL button state
  const checkScrollPosition = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setIsScrolledEnd(scrollLeft >= maxScroll - 35);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition, { passive: true });
      return () => el.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // Liquid Glass "SEE ALL" button handler: reveals additional moments through smooth horizontal scroll
  const handleSeeAll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (scrollLeft >= maxScroll - 35) {
      trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      trackRef.current.scrollBy({ left: clientWidth * 0.75, behavior: 'smooth' });
    }
  };

  const handleCardClick = (moment) => {
    if (moment.isSelf) {
      navigateTo('create');
    } else {
      setActiveStory(moment);
      setStoryLiked(false);
      setStoryReply('');
    }
  };

  const handleSendStoryReply = () => {
    if (storyReply.trim()) {
      showToast(`Sent reply to ${activeStory?.name}: "${storyReply}"`);
      setStoryReply('');
      setActiveStory(null);
    }
  };

  return (
    <>
      <section className="soul-moments-section" aria-label="Soul Moments">
        {/* Section Header */}
        <div className="soul-moments-header">
          <div className="soul-moments-title-row">
            <Sparkles size={15} color="#B98CFF" />
            <h3 className="soul-moments-title">Soul Moments</h3>
            <span className="soul-moments-subtitle">• Living Memory Capsules</span>
          </div>

          {/* Replaced two arrow controls with ONE Liquid Glass SEE ALL control */}
          <button
            className="soul-moments-see-all-btn"
            onClick={handleSeeAll}
            title={isScrolledEnd ? 'View First Moments' : 'Reveal All Moments'}
            aria-label="See All Soul Moments"
          >
            <Sparkles size={12} color="#B98CFF" />
            <span>{isScrolledEnd ? 'Show First' : 'See All'}</span>
          </button>
        </div>

        {/* Horizontal Memory Cards Track (Clean Medium-Sized Cards) */}
        <div className="soul-moments-track" ref={trackRef}>
          {momentsData.map((moment) => (
            <div
              key={moment.id}
              className={`soul-moment-card ${moment.isSelf ? 'is-self' : ''} ${
                moment.isViewed ? 'viewed' : 'unseen'
              }`}
              onClick={() => handleCardClick(moment)}
              title={moment.isSelf ? 'Add to Your Soul Moments' : `View ${moment.name}'s memory`}
            >
              {/* Cover Memory Image */}
              <img
                src={moment.momentImage}
                alt={moment.name}
                className="soul-moment-bg-img"
              />

              {/* Liquid Vignette for Contrast & Text Readability */}
              <div className="soul-moment-vignette" />

              {/* Upper Glass Avatar Pill */}
              <div className="soul-moment-top-glass-chip">
                <div className="soul-moment-avatar-wrap">
                  <img
                    src={moment.avatar}
                    alt={moment.name}
                    className="soul-moment-avatar"
                  />
                  {moment.isSelf && (
                    <div className="soul-moment-add-badge">
                      <Plus size={8} color="#F5F3F7" strokeWidth={3.5} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Info Hierarchy (Author Name & Vibe Label) */}
              <div className="soul-moment-bottom-info">
                <span className="soul-moment-author-name">{moment.name}</span>
                <span className="soul-moment-vibe-tag">{moment.vibe}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Liquid Glass Story Viewer Modal */}
      {activeStory && (
        <div
          className="soul-story-modal-overlay"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="soul-story-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Progress Bar */}
            <div className="soul-story-progress-bar-wrap">
              <div className="soul-story-progress-segment">
                <div className="soul-story-progress-fill" />
              </div>
            </div>

            {/* Modal Header */}
            <div className="soul-story-modal-header">
              <div className="soul-story-modal-user">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.name}
                  className="soul-story-modal-avatar"
                />
                <div>
                  <div className="soul-story-modal-name">{activeStory.name}</div>
                  <div className="soul-story-modal-time">
                    {activeStory.vibe} • {activeStory.timestamp}
                  </div>
                </div>
              </div>

              <button
                className="soul-story-close-btn"
                onClick={() => setActiveStory(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Story Main Image */}
            <img
              src={activeStory.momentImage}
              alt={activeStory.name}
              className="soul-story-modal-image"
            />

            {/* Story Interactive Footer */}
            <div className="soul-story-modal-footer">
              <input
                type="text"
                className="soul-story-reply-input"
                placeholder={`Respond to ${activeStory.name}...`}
                value={storyReply}
                onChange={(e) => setStoryReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendStoryReply();
                }}
              />

              <button
                className="soul-story-react-btn"
                onClick={() => {
                  setStoryLiked(!storyLiked);
                  showToast(storyLiked ? 'Reaction removed' : `Sent ❤️ to ${activeStory.name}`);
                }}
                title="Send heart reaction"
              >
                <Heart
                  size={20}
                  fill={storyLiked ? 'currentColor' : 'none'}
                />
              </button>

              <button
                className="soul-comment-submit-btn"
                onClick={handleSendStoryReply}
                title="Send reply"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoulMomentsBar;
