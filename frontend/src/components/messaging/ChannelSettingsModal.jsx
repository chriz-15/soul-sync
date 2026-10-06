import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Palette,
  Link2,
  Users,
  Sliders,
  ShieldCheck,
  BarChart3,
  Copy,
  Check,
  Share2,
  Camera,
  Sparkles,
  RefreshCw,
  Trash2,
  Lock,
  Globe,
  Radio,
  TrendingUp,
  Target,
  Compass,
  MessageSquare,
  Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const WALLPAPERS = [
  { id: 'nature', name: 'Lush Forest Mist', category: 'Nature', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80' },
  { id: 'sky', name: 'Cosmic Aurora Sky', category: 'Sky', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80' },
  { id: 'ocean', name: 'Pacific Horizon', category: 'Ocean', url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&auto=format&fit=crop&q=80' },
  { id: 'mountains', name: 'Alpine Solitude', category: 'Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
  { id: 'sunset', name: 'Tropical Dusk', category: 'Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' },
  { id: 'stars', name: 'Deep Space Nebula', category: 'Stars', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80' },
  { id: 'abstract', name: 'Neon Cyber Waves', category: 'Abstract', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 'minimal', name: 'Minimal Dark Glass', category: 'Minimal', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' }
];

const COLOR_PRESETS = [
  { id: 'cosmic', name: 'Cosmic Violet', gradient: 'linear-gradient(135deg, rgba(185, 140, 255, 0.22), rgba(184, 50, 104, 0.22))', accent: '#B98CFF' },
  { id: 'aurora', name: 'Cyan Twilight', gradient: 'linear-gradient(135deg, rgba(121, 217, 255, 0.22), rgba(16, 185, 129, 0.18))', accent: '#79D9FF' },
  { id: 'amber', name: 'Amber Horizon', gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(244, 63, 94, 0.2))', accent: '#FBBF24' },
  { id: 'indigo', name: 'Midnight Cyber', gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(217, 70, 239, 0.22))', accent: '#818CF8' },
  { id: 'emerald', name: 'Emerald Mist', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 95, 70, 0.3))', accent: '#34D399' },
  { id: 'rose', name: 'Rosé Dusk', gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.22), rgba(139, 92, 246, 0.22))', accent: '#FB7185' }
];

const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result);
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export const ChannelSettingsModal = ({
  channel,
  isOpen,
  onClose,
  onChannelUpdated
}) => {
  const { currentUser, showToast, fetchChannels, handleDeleteChannel } = useApp();

  // Active sub-section: null (main menu) | 'theme' | 'invite' | 'people' | 'controls' | 'privacy' | 'performance'
  const [activeSection, setActiveSection] = useState(null);

  // Theme editing state
  const [selectedThemeType, setSelectedThemeType] = useState(() => channel?.theme_type || 'default');
  const [selectedThemeColor, setSelectedThemeColor] = useState(() => channel?.theme_color || COLOR_PRESETS[0].gradient);
  const [selectedWallpaper, setSelectedWallpaper] = useState(() => channel?.wallpaper_url || null);
  const [customWallpaper, setCustomWallpaper] = useState(() => channel?.custom_wallpaper || null);
  const [savingTheme, setSavingTheme] = useState(false);

  // Channel Controls state
  const [allowReplies, setAllowReplies] = useState(() => Boolean(channel?.allow_replies || channel?.allowReplies));
  const [savingControls, setSavingControls] = useState(false);

  // Copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Deletion confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen || !channel) return null;

  const isOwner = currentUser && (
    String(channel.owner_user_id) === String(currentUser.id) ||
    !channel.owner_user_id
  );

  // Canonical avatar resolution following the Soul Sync global sync architecture
  const channelAvatar = isOwner
    ? (currentUser?.avatar_url || channel.partner_avatar || channel.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
    : (channel.partner_avatar || channel.owner_avatar || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const channelName = channel.partner_name || channel.name || 'Channel';
  const channelId = channel.channel_id || channel.id;
  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${channelId}`
    : `https://soulsync.io/join/${channelId}`;

  const membersList = channel.members || [];
  const memberCount = membersList.length || 1;
  const totalMessages = channel.stats?.total_messages || 0;
  const activeContributors = channel.stats?.active_contributors || 0;

  // Handle Theme Apply
  const handleApplyTheme = async () => {
    if (!isOwner) {
      showToast('Only the channel owner can customize the theme');
      return;
    }
    setSavingTheme(true);
    try {
      const payload = {
        theme_type: selectedThemeType,
        theme_color: selectedThemeColor,
        wallpaper_url: selectedWallpaper,
        custom_wallpaper: customWallpaper
      };
      const res = await api.updateChannel(channelId, payload);
      if (res && res.success) {
        showToast('Channel theme applied & persisted ✨');
        if (onChannelUpdated) onChannelUpdated(res.channel);
        await fetchChannels();
      } else {
        showToast((res && res.message) || 'Failed to apply theme');
      }
    } catch (e) {
      console.error('Theme save error:', e);
      showToast('Network error updating channel theme');
    } finally {
      setSavingTheme(false);
    }
  };

  // Handle Random Color Selection
  const handleRandomizeColor = () => {
    const randomIndex = Math.floor(Math.random() * COLOR_PRESETS.length);
    const chosen = COLOR_PRESETS[randomIndex];
    setSelectedThemeType('gradient');
    setSelectedThemeColor(chosen.gradient);
    showToast(`Generated: ${chosen.name}`);
  };

  // Handle Custom Wallpaper Upload
  const handleCustomPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1400, 900, 0.82);
      if (compressed) {
        setCustomWallpaper(compressed);
        setSelectedWallpaper(null);
        setSelectedThemeType('custom');
        showToast('Custom photo loaded for preview');
      }
    } catch (err) {
      console.error('Failed to process wallpaper:', err);
      showToast('Could not process custom image');
    }
  };

  // Handle Allow Replies Toggle
  const handleToggleReplies = async () => {
    if (!isOwner) {
      showToast('Only the channel owner can adjust reply permissions');
      return;
    }
    const nextState = !allowReplies;
    setAllowReplies(nextState);
    setSavingControls(true);
    try {
      const res = await api.updateChannel(channelId, { allow_replies: nextState });
      if (res && res.success) {
        showToast(nextState ? 'Members can now reply in this channel' : 'Channel set to Broadcast Only');
        if (onChannelUpdated) onChannelUpdated(res.channel);
        await fetchChannels();
      } else {
        setAllowReplies(!nextState);
        showToast('Failed to update reply permissions');
      }
    } catch (e) {
      console.error('Controls save error:', e);
      setAllowReplies(!nextState);
      showToast('Network error saving reply controls');
    } finally {
      setSavingControls(false);
    }
  };

  // Copy Invite Link
  const handleCopyInviteLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    setCopiedLink(true);
    showToast('Unique invite link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2400);
  };

  // Share Invite Link
  const handleShareInviteLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Join ${channelName} on Soul Sync`,
          text: `Tune in to ${channelName}'s permanent broadcast on Soul Sync ✨`,
          url: inviteLink
        });
        showToast('Invite link shared successfully');
        return;
      } catch (err) {
        // User cancelled or unsupported
      }
    }
    handleCopyInviteLink();
  };

  // Copy Channel ID
  const handleCopyChannelId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(channelId);
    }
    setCopiedId(true);
    showToast('Channel ID copied');
    setTimeout(() => setCopiedId(false), 2400);
  };

  // Delete Channel
  const handleExecuteDelete = async () => {
    if (!isOwner) return;
    setDeleting(true);
    try {
      const ok = await handleDeleteChannel(channelId);
      if (ok) {
        onClose();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="message-edit-flow-backdrop channel-settings-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 9, 18, 0.78)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem'
      }}
    >
      <div
        className="liquid-glass-panel channel-settings-modal-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          borderRadius: '24px',
          background: 'rgba(18, 22, 38, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 50px rgba(185, 140, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Subtle Liquid Glow Backdrop Core */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(185, 140, 255, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Modal Top Navigation Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            zIndex: 2
          }}
        >
          {activeSection ? (
            <button
              type="button"
              className="btn-secondary-glass"
              onClick={() => setActiveSection(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '10px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={16} color="#79D9FF" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#79D9FF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Channel Settings
              </span>
            </div>
          )}

          <button
            type="button"
            className="message-edit-close-btn"
            onClick={onClose}
            aria-label="Close Channel Settings"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#A9ADBC',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ===================================================
            CHANNEL IDENTITY BANNER (TOP OF SETTINGS EXPERIENCE)
            =================================================== */}
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            position: 'relative'
          }}
        >
          {/* Avatar Section - Resolves Owner's Canonical Soul Sync Photo */}
          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <img
              src={channelAvatar}
              alt={channelName}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                objectFit: 'cover',
                border: '2px solid rgba(185, 140, 255, 0.45)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(185, 140, 255, 0.25)'
              }}
            />
            {isOwner && (
              <div
                title="Channel Owner"
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #B83268 0%, #B98CFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #0E1220',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
                }}
              >
                <Crown size={11} color="#FFFFFF" />
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.35rem' }}>
            {channelName}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(121, 217, 255, 0.14)',
                border: '1px solid rgba(121, 217, 255, 0.3)',
                color: '#79D9FF'
              }}
            >
              Permanent Channel
            </span>
            <span style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>
              • {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>

          {channel.description && (
            <p style={{ fontSize: '0.84rem', color: '#A9ADBC', marginTop: '0.65rem', maxWidth: '380px', lineHeight: 1.45 }}>
              {channel.description}
            </p>
          )}
        </div>

        {/* Scrollable Container for Menu or Sub-Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {/* ===================================================
              MAIN VIEW: 6 SECTION TILES
              =================================================== */}
          {!activeSection && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* 1. Theme */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('theme')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(185, 140, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Palette size={18} color="#B98CFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>Theme</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>Colors, wallpaper gallery & custom backgrounds</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* 2. Invite Link */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('invite')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(121, 217, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link2 size={18} color="#79D9FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>Invite Link</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>Share permanent channel invitation</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* 3. People */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('people')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(184, 50, 104, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} color="#B83268" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>People</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>{memberCount} members connected • View roles</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* 4. Channel Controls */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('controls')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(185, 140, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sliders size={18} color="#B98CFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>Channel Controls</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>Member replies & broadcast modes</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* 5. Privacy & Safety */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('privacy')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(121, 217, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} color="#79D9FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>Privacy & Safety</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>Channel visibility & harmonic safety</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* 6. Channel Performance */}
              <div
                className="liquid-glass-card"
                onClick={() => setActiveSection('performance')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.15rem',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={18} color="#10B981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F5F3F7' }}>Channel Performance</div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC' }}>Real broadcast analytics & insights</div>
                  </div>
                </div>
                <ChevronRight size={17} color="#A9ADBC" />
              </div>

              {/* Danger Zone: Delete Channel (Owner Only) */}
              {isOwner && (
                <div style={{ marginTop: '0.5rem' }}>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        borderRadius: '14px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Trash2 size={15} />
                      <span>Delete Channel</span>
                    </button>
                  ) : (
                    <div
                      className="liquid-glass-card"
                      style={{
                        padding: '1rem',
                        borderRadius: '16px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FEE2E2' }}>
                        Permanently delete this channel?
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#FCA5A5' }}>
                        This cannot be undone. All messages and memberships will be removed.
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="btn-secondary-glass"
                          style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteDelete}
                          disabled={deleting}
                          style={{
                            flex: 1,
                            padding: '0.45rem',
                            fontSize: '0.78rem',
                            borderRadius: '10px',
                            background: '#ef4444',
                            border: 'none',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {deleting ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 1: THEME
              =================================================== */}
          {activeSection === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7' }}>Channel Theme</h3>
                <button
                  type="button"
                  onClick={handleRandomizeColor}
                  className="btn-secondary-glass"
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Generate vibrant harmonious palette"
                >
                  <Sparkles size={13} color="#B98CFF" />
                  <span>Random Color</span>
                </button>
              </div>

              {/* Live Preview Container */}
              <div>
                <div style={{ fontSize: '0.78rem', color: '#A9ADBC', marginBottom: '0.45rem' }}>
                  Live Chat Theme Preview
                </div>
                <div
                  style={{
                    height: '140px',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '0.85rem',
                    background: (customWallpaper || selectedWallpaper)
                      ? `linear-gradient(rgba(10, 14, 28, 0.75), rgba(10, 14, 28, 0.88)), url("${customWallpaper || selectedWallpaper}")`
                      : (selectedThemeColor || 'rgba(18, 22, 38, 0.9)'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '0.4rem 0.75rem', borderRadius: '12px', fontSize: '0.76rem', color: '#F5F3F7' }}>
                    Welcome to our broadcast community! ✨
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #B83268 0%, #B98CFF 100%)', padding: '0.4rem 0.75rem', borderRadius: '12px', fontSize: '0.76rem', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(184, 50, 104, 0.4)' }}>
                    Theme preview active & ready to apply.
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <div style={{ fontSize: '0.78rem', color: '#A9ADBC', marginBottom: '0.45rem' }}>
                  Ambient Color Palettes
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {COLOR_PRESETS.map((p) => {
                    const isSelected = selectedThemeType === 'gradient' && selectedThemeColor === p.gradient && !selectedWallpaper && !customWallpaper;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedThemeType('gradient');
                          setSelectedThemeColor(p.gradient);
                          setSelectedWallpaper(null);
                          setCustomWallpaper(null);
                        }}
                        style={{
                          height: '42px',
                          borderRadius: '12px',
                          background: p.gradient,
                          border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.15)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.74rem',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          boxShadow: isSelected ? `0 0 14px ${p.accent}` : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSelected && <Check size={14} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wallpaper Gallery */}
              <div>
                <div style={{ fontSize: '0.78rem', color: '#A9ADBC', marginBottom: '0.45rem' }}>
                  Aesthetic Wallpaper Gallery
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                  {WALLPAPERS.map((w) => {
                    const isSelected = selectedWallpaper === w.url && !customWallpaper;
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          setSelectedWallpaper(w.url);
                          setCustomWallpaper(null);
                          setSelectedThemeType('wallpaper');
                        }}
                        style={{
                          height: '64px',
                          borderRadius: '12px',
                          backgroundImage: `url("${w.url}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: isSelected ? '2px solid #79D9FF' : '1px solid rgba(255, 255, 255, 0.12)',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: isSelected ? '0 0 14px rgba(121, 217, 255, 0.5)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        title={w.name}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.75) 100%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '0.3rem',
                            fontSize: '0.68rem',
                            color: '#FFFFFF',
                            fontWeight: 600
                          }}
                        >
                          {isSelected ? <Check size={12} color="#79D9FF" /> : w.category}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Photo Upload */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '0.9rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Camera size={18} color="#B98CFF" />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#F5F3F7' }}>Custom Photo</div>
                    <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>Upload your own photo as background</div>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-secondary-glass"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem' }}
                >
                  Choose File
                </button>
              </div>

              {/* Apply Theme Button */}
              {isOwner && (
                <button
                  type="button"
                  className="btn-primary-gradient"
                  onClick={handleApplyTheme}
                  disabled={savingTheme}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    marginTop: '0.5rem'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{savingTheme ? 'Applying & Persisting...' : 'Apply Theme'}</span>
                </button>
              )}
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 2: INVITE LINK
              =================================================== */}
          {activeSection === 'invite' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.3rem' }}>
                  Channel Invite Link
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#A9ADBC' }}>
                  Every Soul Sync channel has a permanent, unique invitation identity.
                </p>
              </div>

              {/* Unique Link Card */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '1.15rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(121, 217, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#79D9FF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Permanent Invitation URL
                </div>
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    wordBreak: 'break-all',
                    fontSize: '0.84rem',
                    color: '#F5F3F7',
                    fontFamily: 'monospace'
                  }}
                >
                  {inviteLink}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="btn-secondary-glass"
                    onClick={handleCopyInviteLink}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.55rem', fontSize: '0.82rem' }}
                  >
                    {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary-gradient"
                    onClick={handleShareInviteLink}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.55rem', fontSize: '0.82rem' }}
                  >
                    <Share2 size={14} />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>

              {/* Unique Channel ID Card */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.025)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#A9ADBC', textTransform: 'uppercase' }}>Channel Token ID</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#79D9FF', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                    {channelId}
                  </div>
                </div>
                <button
                  type="button"
                  className="individual-chat-controls-btn"
                  onClick={handleCopyChannelId}
                  title="Copy Channel Token ID"
                >
                  {copiedId ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Guidelines Card */}
              <div style={{ fontSize: '0.78rem', color: '#A9ADBC', lineHeight: 1.5, padding: '0 0.2rem' }}>
                💡 Anyone with this invitation link can view and join your Soul Sync broadcast. You can manage member permissions anytime under Channel Controls.
              </div>
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 3: PEOPLE
              =================================================== */}
          {activeSection === 'people' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7' }}>People & Members</h3>
                  <p style={{ fontSize: '0.78rem', color: '#A9ADBC' }}>
                    {memberCount} {memberCount === 1 ? 'soul' : 'souls'} connected to this frequency
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.7rem',
                    borderRadius: '9999px',
                    background: 'rgba(185, 140, 255, 0.14)',
                    color: '#B98CFF',
                    border: '1px solid rgba(185, 140, 255, 0.3)'
                  }}
                >
                  {memberCount} Total
                </span>
              </div>

              {/* Real Members Scroll List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {membersList.length > 0 ? (
                  membersList.map((m) => {
                    const isMemberOwner = Boolean(
                      m.is_owner ||
                      String(m.id) === String(channel.owner_user_id) ||
                      (isOwner && String(m.id) === String(currentUser?.id))
                    );
                    const memberAvatar = (isMemberOwner && isOwner)
                      ? (currentUser?.avatar_url || m.avatar)
                      : (m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

                    return (
                      <div
                        key={m.id}
                        className="liquid-glass-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 0.95rem',
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={memberAvatar}
                            alt={m.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: isMemberOwner ? '2px solid #B98CFF' : '1px solid rgba(255, 255, 255, 0.12)'
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>
                              {m.name || m.username}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>
                              @{m.username}
                            </div>
                          </div>
                        </div>

                        {isMemberOwner ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              background: 'rgba(185, 140, 255, 0.2)',
                              color: '#B98CFF',
                              border: '1px solid rgba(185, 140, 255, 0.4)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Crown size={10} />
                            <span>Owner</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#A9ADBC'
                            }}
                          >
                            Member
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Fallback to Owner if members list hasn't populated */
                  <div
                    className="liquid-glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={channelAvatar}
                        alt="Owner"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #B98CFF' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>
                          {isOwner ? (currentUser?.name || 'You') : (channel.owner_name || 'Channel Owner')}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>
                          @{isOwner ? currentUser?.username : (channel.owner_username || 'owner')}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(185, 140, 255, 0.2)', color: '#B98CFF' }}>
                      Owner
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 4: CHANNEL CONTROLS
              =================================================== */}
          {activeSection === 'controls' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.3rem' }}>
                  Channel Controls
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#A9ADBC' }}>
                  Manage discussion permissions and broadcast behavior.
                </p>
              </div>

              {/* Allow Members to Reply Toggle Card */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '1.15rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.25rem' }}>
                    Allow Members to Reply
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#A9ADBC', lineHeight: 1.45, maxWidth: '340px' }}>
                    {allowReplies
                      ? 'ON: Connected members can participate and send messages in community discussion.'
                      : 'OFF: Broadcast Only. Only the channel owner can post announcements.'}
                  </div>
                </div>

                {/* Liquid Toggle Switch */}
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px', flexShrink: 0, cursor: isOwner ? 'pointer' : 'not-allowed' }}>
                  <input
                    type="checkbox"
                    checked={allowReplies}
                    onChange={handleToggleReplies}
                    disabled={!isOwner || savingControls}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: isOwner ? 'pointer' : 'not-allowed',
                      inset: 0,
                      backgroundColor: allowReplies ? '#B98CFF' : 'rgba(255, 255, 255, 0.15)',
                      backgroundImage: allowReplies ? 'linear-gradient(135deg, #B83268 0%, #B98CFF 100%)' : 'none',
                      borderRadius: '34px',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: allowReplies ? '0 0 14px rgba(185, 140, 255, 0.45)' : 'none'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: allowReplies ? '26px' : '4px',
                        bottom: '4px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                      }}
                    />
                  </span>
                </label>
              </div>

              {!isOwner && (
                <div style={{ fontSize: '0.78rem', color: '#FB7185', padding: '0 0.2rem' }}>
                  🔒 Only the channel owner can change reply permissions.
                </div>
              )}

              {/* Status Info */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  fontSize: '0.78rem',
                  color: '#A9ADBC',
                  lineHeight: 1.5
                }}
              >
                📡 Mode status: <strong style={{ color: allowReplies ? '#10B981' : '#79D9FF' }}>{allowReplies ? 'Open Discussion Community' : 'Official Announcement Channel'}</strong>. This setting is persisted permanently to your channel identity.
              </div>
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 5: PRIVACY & SAFETY
              =================================================== */}
          {activeSection === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.3rem' }}>
                  Privacy & Safety
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#A9ADBC' }}>
                  Core visibility controls and subscriber privacy standards.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Channel Visibility */}
                <div
                  className="liquid-glass-card"
                  style={{
                    padding: '0.95rem 1.1rem',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={18} color="#79D9FF" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>Channel Visibility</div>
                      <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>Discoverable broadcast across Soul Sync collective</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#79D9FF' }}>Public</span>
                </div>

                {/* Member Identity Protection */}
                <div
                  className="liquid-glass-card"
                  style={{
                    padding: '0.95rem 1.1rem',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Lock size={18} color="#B98CFF" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>Subscriber Privacy</div>
                      <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>Phone numbers & private emails remain masked</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#10B981' }}>Protected</span>
                </div>

                {/* Content Resonance Shield */}
                <div
                  className="liquid-glass-card"
                  style={{
                    padding: '0.95rem 1.1rem',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={18} color="#10B981" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>Content Resonance Shield</div>
                      <div style={{ fontSize: '0.74rem', color: '#A9ADBC' }}>Automated harmony and spam prevention filter</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#10B981' }}>Active</span>
                </div>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#A9ADBC', padding: '0 0.2rem', lineHeight: 1.5 }}>
                🛡️ Architecture ready: Further granular permission matrices will be configured as the Soul Sync network expands.
              </div>
            </div>
          )}

          {/* ===================================================
              SUB-PANEL 6: CHANNEL PERFORMANCE
              =================================================== */}
          {activeSection === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.3rem' }}>
                  Channel Performance & Insights
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#A9ADBC' }}>
                  Actual channel metrics calculated directly from database activity.
                </p>
              </div>

              {/* A. Channel Overview (Real Metrics) */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#79D9FF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Channel Overview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <div className="liquid-glass-card" style={{ padding: '0.85rem', borderRadius: '14px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5F3F7' }}>
                      {memberCount}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#A9ADBC', marginTop: '0.15rem' }}>
                      Members
                    </div>
                  </div>

                  <div className="liquid-glass-card" style={{ padding: '0.85rem', borderRadius: '14px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B98CFF' }}>
                      {totalMessages}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#A9ADBC', marginTop: '0.15rem' }}>
                      Messages
                    </div>
                  </div>

                  <div className="liquid-glass-card" style={{ padding: '0.85rem', borderRadius: '14px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#79D9FF' }}>
                      {activeContributors}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#A9ADBC', marginTop: '0.15rem' }}>
                      Contributors
                    </div>
                  </div>
                </div>
              </div>

              {/* B. Insights */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#B98CFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Activity Insights
                </div>

                {totalMessages > 0 ? (
                  <div
                    className="liquid-glass-card"
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
                      <TrendingUp size={16} />
                      <span>Active Broadcast Stream</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#A9ADBC', lineHeight: 1.45 }}>
                      This channel has {totalMessages} messages recorded. Communication velocity is steady with {activeContributors} active participants engaging.
                    </div>
                  </div>
                ) : (
                  <div
                    className="liquid-glass-card"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <MessageSquare size={24} color="#A9ADBC" style={{ opacity: 0.6 }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F3F7' }}>
                      No messages recorded yet
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#A9ADBC', maxWidth: '300px' }}>
                      Start broadcasting or enable replies in Channel Controls to generate live analytics.
                    </div>
                  </div>
                )}
              </div>

              {/* C. Goals */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Channel Goals
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="liquid-glass-card" style={{ padding: '0.75rem 0.9rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.025)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <Target size={16} color="#FBBF24" />
                    <div style={{ fontSize: '0.82rem', color: '#F5F3F7' }}>
                      <strong>Grow Audience:</strong> Share your unique Invite Link with friends and collaborators.
                    </div>
                  </div>

                  <div className="liquid-glass-card" style={{ padding: '0.75rem 0.9rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.025)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <Sparkles size={16} color="#B98CFF" />
                    <div style={{ fontSize: '0.82rem', color: '#F5F3F7' }}>
                      <strong>Spark Interaction:</strong> Enable member replies to turn broadcasts into collaborative discussions.
                    </div>
                  </div>
                </div>
              </div>

              {/* D. Best Practices */}
              <div
                className="liquid-glass-card"
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  fontSize: '0.78rem',
                  color: '#A9ADBC',
                  lineHeight: 1.5
                }}
              >
                ✨ <strong>Best Practices:</strong> Curate high-signal announcements, customize a distinctive aesthetic theme, and maintain regular updates to keep community resonance high.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSettingsModal;
