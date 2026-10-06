import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  MapPin,
  Clock,
  Sparkles,
  Radio,
  Quote,
  Flame,
  Calendar,
  Waves
} from 'lucide-react';

const SoulPostCard = ({ post }) => {
  const {
    handleLikePost,
    handleSavePost,
    handleAddComment,
    navigateTo,
    setReportModalOpen,
    showToast,
    currentUser
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine post composition style based on post data & content
  const getCompositionType = (p) => {
    if (p.composition) return p.composition;
    if (p.id === 1 || p.caption?.toLowerCase().includes('sunset') || p.caption?.toLowerCase().includes('poetry')) {
      return 'cinematic';
    }
    if (p.id === 2 || p.caption?.toLowerCase().includes('silence') || p.caption?.includes('"')) {
      return 'quote';
    }
    if (p.id === 3 || p.caption?.toLowerCase().includes('waves') || p.caption?.toLowerCase().includes('tide')) {
      return 'memory';
    }
    if (p.id === 4 || p.caption?.toLowerCase().includes('neon') || p.caption?.toLowerCase().includes('liquid glass')) {
      return 'feeling';
    }
    return 'standard';
  };

  const composition = getCompositionType(post);

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    handleLikePost(post.id);
  };

  const submitComment = (e) => {
    if (e) e.preventDefault();
    if (commentText.trim()) {
      handleAddComment(post.id, commentText);
      setCommentText('');
      setShowAllComments(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#post-' + post.id);
    }
    showToast('Post frequency shared to clipboard ✨');
  };

  const comments = post.comments || [];
  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <article className="soul-post-card" id={`post-${post.id}`}>
      {/* Background Ambient Liquid Glow */}
      <div className="soul-post-ambient-glow" />

      {/* 1. Post Header */}
      <header className="soul-post-header">
        <div
          className="soul-post-author-block"
          onClick={() => navigateTo('profile')}
          title={`View ${post.author_name}'s profile`}
        >
          <div className="soul-post-author-avatar-wrap">
            <img
              src={
                post.author_avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={post.author_name}
              className="soul-post-author-avatar"
            />
          </div>
          <div className="soul-post-meta">
            <div className="soul-post-author-name-row">
              <span className="soul-post-author-name">{post.author_name}</span>
              <span className="soul-post-author-handle">
                @{post.author_username || 'soul'}
              </span>
            </div>
            <div className="soul-post-submeta">
              {post.location && (
                <span className="soul-post-location-pill">
                  <MapPin size={12} />
                  <span>{post.location}</span>
                </span>
              )}
              <span>•</span>
              <span>2h ago</span>
            </div>
          </div>
        </div>

        <div className="soul-post-header-actions">
          {/* Subtle Composition Badge */}
          <span className="soul-post-composition-badge">
            {composition === 'cinematic' && 'Cinematic'}
            {composition === 'quote' && 'Reflection'}
            {composition === 'memory' && 'Soul Echo'}
            {composition === 'feeling' && 'Frequency'}
            {composition === 'standard' && 'Moment'}
          </span>

          {/* Options Menu Button */}
          <button
            className="soul-post-menu-btn"
            onClick={() => setReportModalOpen(true)}
            title="Post actions & options"
            aria-label="Post options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* 2. Post Media / Visual Composition */}
      {composition === 'cinematic' && (
        <div className="soul-comp-cinematic">
          <img
            src={post.media_url}
            alt="Cinematic moment"
            className="soul-comp-cinematic-img"
          />
          <div className="soul-comp-cinematic-overlay-pill">
            <Sparkles size={13} color="#B98CFF" />
            <span>432 Hz • Golden Hour Horizon</span>
          </div>
        </div>
      )}

      {composition === 'quote' && (
        <div className="soul-comp-quote-container">
          <div className="soul-comp-quote-media">
            <img src={post.media_url} alt="Reflection scenery" />
          </div>
          <div className="soul-comp-quote-text-panel">
            <span className="soul-comp-quote-mark">“</span>
            <p className="soul-comp-quote-body">
              {post.caption?.split('.')[0] || 'The silence here heals what was broken.'}.
            </p>
            <span className="soul-comp-quote-author">
              — {post.author_name} • Inner Reflection
            </span>
          </div>
        </div>
      )}

      {composition === 'memory' && (
        <div className="soul-comp-memory-container">
          <div className="soul-comp-memory-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Calendar size={14} color="#79D9FF" />
              <span>ON THIS DAY • SOUL MEMORY</span>
            </div>
            <span className="soul-comp-memory-date">1 Year Ago Today</span>
          </div>
          <div className="soul-comp-memory-media">
            <img src={post.media_url} alt="Memory capture" />
          </div>
        </div>
      )}

      {composition === 'feeling' && (
        <>
          <div className="soul-comp-feeling-pill-bar">
            <div className="soul-vibe-frequency-pill">
              <Radio size={14} color="#79D9FF" />
              <span>Nocturnal Resonance • 528 Hz</span>
              <div className="soul-vibe-wave-anim">
                <span className="soul-vibe-wave-bar" />
                <span className="soul-vibe-wave-bar" />
                <span className="soul-vibe-wave-bar" />
                <span className="soul-vibe-wave-bar" />
              </div>
            </div>
          </div>
          <div className="soul-comp-standard-media">
            <img src={post.media_url} alt="Vibrational frequency capture" />
          </div>
        </>
      )}

      {composition === 'standard' && (
        <div className="soul-comp-standard-media">
          <img src={post.media_url} alt="Moment capture" />
        </div>
      )}

      {/* 3. Reimagined Liquid Glass Post Interactions Bar */}
      <div className="soul-post-actions-panel">
        <div className="soul-actions-group-left">
          {/* Like Interaction */}
          <button
            className={`soul-action-pill-btn ${post.is_liked ? 'liked' : ''} ${
              likeAnim ? 'soul-reaction-heart-pulse' : ''
            }`}
            onClick={handleLike}
            title={post.is_liked ? 'Unlike post' : 'Resonate with post'}
          >
            <Heart
              size={18}
              fill={post.is_liked ? 'currentColor' : 'none'}
            />
            <span>{post.likes_count?.toLocaleString() || 0}</span>
          </button>

          {/* Comment Drawer Toggle */}
          <button
            className="soul-action-pill-btn"
            onClick={() => setShowAllComments(!showAllComments)}
            title="View comments"
          >
            <MessageCircle size={18} />
            <span>{comments.length || post.comments_count || 0}</span>
          </button>

          {/* Share Interaction */}
          <button
            className="soul-action-pill-btn"
            onClick={handleShare}
            title="Share this moment"
          >
            <Share2 size={17} />
            <span>{post.shares_count || 24}</span>
          </button>
        </div>

        {/* Save / Bookmark Interaction */}
        <button
          className={`soul-action-pill-btn ${post.is_saved ? 'saved' : ''}`}
          onClick={() => handleSavePost(post.id)}
          title={post.is_saved ? 'Saved to Soul Sync' : 'Save memory'}
        >
          <Bookmark
            size={18}
            fill={post.is_saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* 4. Caption */}
      <div className="soul-post-caption-box">
        <span className="soul-post-caption-author">{post.author_name}</span>
        <span>{post.caption}</span>
      </div>

      {/* 5. Comments Thread Preview */}
      <div className="soul-comments-section">
        {comments.length > 2 && (
          <button
            className="soul-comments-toggle-btn"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments
              ? 'Collapse reflections'
              : `View all ${comments.length} reflections`}
          </button>
        )}

        {displayedComments.length > 0 && (
          <div className="soul-comments-list">
            {displayedComments.map((comm, idx) => (
              <div key={comm.id || idx} className="soul-comment-row">
                <img
                  src={
                    comm.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={comm.username || 'user'}
                  className="soul-comment-avatar"
                />
                <div className="soul-comment-content">
                  <span className="soul-comment-user">
                    @{comm.username || 'wanderer'}
                  </span>
                  <span className="soul-comment-text">{comm.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Input Row */}
        <form className="soul-comment-composer" onSubmit={submitComment}>
          <input
            type="text"
            className="soul-comment-input"
            placeholder="Add your reflection..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="soul-comment-submit-btn"
            disabled={!commentText.trim()}
            title="Post reflection"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </article>
  );
};

export default SoulPostCard;
