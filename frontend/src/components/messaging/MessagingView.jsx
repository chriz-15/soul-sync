import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp, formatChannelToConversation } from '../../context/AppContext';
import api from '../../services/api';
import MessageEditFlow from './MessageEditFlow';
import ChannelSettingsModal from './ChannelSettingsModal';
import SoulNotesSection from './SoulNotesSection';
import {
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Mic,
  Smile,
  Send,
  ArrowLeft,
  Edit3,
  Pin,
  Trash2,
  Copy,
  X,
  Settings,
  Radio
} from 'lucide-react';

const formatMessageTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Just now';
  }
};

const MessagingView = () => {
  const {
    currentUser,
    conversations,
    setConversations,
    setProfileChannels,
    fetchChannels,
    handleDeleteChannel,
    activeChatId,
    setActiveChatId,
    activeChatMessages,
    setActiveChatMessages,
    handleSendMessage,
    showToast,
    suggestedUsers
  } = useApp();

  const [editFlowOpen, setEditFlowOpen] = useState(false);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(false);

  // Navigation & Transition State:
  // viewMode: 'list' | 'chat'
  // transitionPhase: 'idle' | 'forward' | 'backward'
  const [viewMode, setViewMode] = useState('list');
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const [selectedConv, setSelectedConv] = useState(null);
  const animTimeoutRef = useRef(null);

  const [messageInput, setMessageInput] = useState('');
  const [tabFilter, setTabFilter] = useState('All'); // 'All' | 'Personal' | 'Groups'
  const [searchQuery, setSearchQuery] = useState('');
  const listContainerRef = useRef(null);

  useEffect(() => {
    if (fetchChannels) {
      fetchChannels();
    }
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Current active conversation
  const activeConversation =
    selectedConv ||
    conversations.find((c) => c.id === activeChatId) ||
    conversations[0];

  const handleSelectChat = (conv) => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setSelectedConv(conv);
    setActiveChatId(conv.id);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setViewMode('chat');
      setTransitionPhase('idle');
      return;
    }

    // Forward travel transition: current view moves away, destination travels forward into focus
    setViewMode('chat');
    setTransitionPhase('forward');

    animTimeoutRef.current = setTimeout(() => {
      setTransitionPhase('idle');
    }, 340);
  };

  const handleBackToList = () => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setViewMode('list');
      setTransitionPhase('idle');
      setSelectedConv(null);
      return;
    }

    // Backward travel transition: destination moves away, list travels forward back into focus
    setViewMode('list');
    setTransitionPhase('backward');

    animTimeoutRef.current = setTimeout(() => {
      setTransitionPhase('idle');
      setSelectedConv(null);
    }, 320);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeConversation?.channel_id, activeConversation?.id]);

  useEffect(() => {
    scrollToBottom(true);
  }, [activeChatMessages?.length]);

  const onSend = (e) => {
    if (e) e.preventDefault();
    const textToSend = messageInput.trim();
    if (!textToSend) return;

    const targetId = activeConversation?.channel_id || activeConversation?.id || activeChatId;
    handleSendMessage(textToSend, null, targetId);
    setMessageInput('');
  };

  // Pre-configured and dynamically detected available users/followers for groups & channels
  const availableUsers = useMemo(() => {
    const baseList = [
      { id: 2, name: 'Megha', username: 'megha_official', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80' },
      { id: 3, name: 'Arjun', username: 'arjun_v', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
      { id: 4, name: 'Sahana', username: 'sahana_m', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
      { id: 5, name: 'Vikram', username: 'vikram_r', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
      { id: 6, name: 'Priya', username: 'priya_arts', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80' },
      { id: 7, name: 'Kavya Nair', username: 'kavya_nair', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
      { id: 8, name: 'Rohan Sharma', username: 'rohan_s', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' }
    ];

    const userMap = new Map();
    baseList.forEach((u) => userMap.set(u.id, u));

    (suggestedUsers || []).forEach((u) => {
      if (u.id && !userMap.has(u.id)) {
        userMap.set(u.id, {
          id: u.id,
          name: u.name || u.username,
          username: u.username,
          avatar: u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        });
      }
    });

    (conversations || []).forEach((c) => {
      if (c.partner_id && !userMap.has(c.partner_id)) {
        userMap.set(c.partner_id, {
          id: c.partner_id,
          name: c.partner_name,
          username: c.partner_username || c.partner_name.toLowerCase().replace(/\s+/g, '_'),
          avatar: c.partner_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        });
      }
    });

    return Array.from(userMap.values());
  }, [conversations, suggestedUsers]);

  // Handler for creating a new group conversation
  const handleCreateGroup = ({ name, members }) => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup = {
      id: newGroupId,
      partner_id: newGroupId,
      partner_name: name,
      partner_username: name.toLowerCase().replace(/\s+/g, '_'),
      partner_avatar:
        members[0]?.avatar ||
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      is_group: true,
      isGroup: true,
      members,
      last_message: `Group created with ${members.length} member${members.length > 1 ? 's' : ''}`,
      last_message_time: 'Just now',
      unread_count: 0
    };

    if (setConversations) {
      setConversations((prev) => [newGroup, ...prev]);
    }
    showToast(`Group "${name}" created!`);
  };

  // Handler for creating a new permanent channel broadcast in SQL
  const handleCreateChannel = async ({ name, audience, isPinned, showOnProfile, allowReplies }) => {
    try {
      const payload = {
        name,
        audience: (audience || []).map((u) => (typeof u === 'object' && u !== null ? u.id : u)),
        is_pinned: isPinned,
        show_on_profile: showOnProfile,
        allow_replies: allowReplies,
        channel_type: 'channel'
      };

      const res = await api.createChannel(payload);
      if (res && res.success && res.channel) {
        const formatted = formatChannelToConversation(res.channel, currentUser);
        if (setConversations) {
          setConversations((prev) => [
            formatted,
            ...prev.filter((c) => c.channel_id !== formatted.channel_id && c.id !== formatted.id)
          ]);
        }
        if (showOnProfile && setProfileChannels) {
          setProfileChannels((prev) => [
            formatted,
            ...prev.filter((c) => c.channel_id !== formatted.channel_id && c.id !== formatted.id)
          ]);
        }
        showToast(`Channel "${name}" created! (ID: ${res.channel.channel_id})`);
        return res.channel;
      } else {
        showToast((res && res.message) || 'Failed to create channel');
      }
    } catch (err) {
      console.error('Channel creation error:', err);
      showToast('Error connecting to server to create channel');
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((c) => {
        const matches = (c.partner_name || '').toLowerCase().includes(searchQuery.toLowerCase());
        if (!matches) return false;
        if (tabFilter === 'Groups') return Boolean(c.is_group || c.isGroup || c.is_channel || c.isChannel);
        if (tabFilter === 'Personal') return !c.is_group && !c.isGroup && !c.is_channel && !c.isChannel;
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
  }, [conversations, searchQuery, tabFilter]);

  // Both views exist simultaneously during transition to create unified continuous motion
  const showList = viewMode === 'list' || transitionPhase === 'forward';
  const showChat = viewMode === 'chat' || transitionPhase === 'backward';

  const listTransitionClass =
    transitionPhase === 'forward'
      ? 'chat-view-exit-forward'
      : transitionPhase === 'backward'
      ? 'chat-view-enter-backward'
      : '';

  const chatTransitionClass =
    transitionPhase === 'forward'
      ? 'chat-view-enter-forward'
      : transitionPhase === 'backward'
      ? 'chat-view-exit-backward'
      : '';

  return (
    <div className="messaging-flow-container">
      {/* ===================================================
          STAGE 1 — MESSAGES LIST VIEW (COMPLETE LIQUID UI)
          =================================================== */}
      {showList && (
        <div
          ref={listContainerRef}
          className={`liquid-glass-panel messages-list-stage ${listTransitionClass}`}
        >
          {/* Header */}
          <div>
            <div className="messages-header-row">
              <h2 className="messages-header-title">Messages</h2>
              <div className="messages-header-actions">
                <span className="messages-active-indicator">
                  <span className="messages-active-indicator-dot" />
                  <span>{conversations.length} Active Conversations</span>
                </span>
                <button
                  type="button"
                  className="messages-edit-btn"
                  onClick={() => setEditFlowOpen(true)}
                  aria-label="Edit and create new conversation"
                  title="New Group or Channel"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            </div>

            {/* Elevated Liquid Search Field */}
            <div className="messages-search-container">
              <input
                type="text"
                placeholder="Search chats (e.g. Arjun, Sahana, Priya)..."
                className="messages-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="messages-search-icon" />
            </div>

            {/* Premium Soul Notes Integration — Reference-Based Organic Liquid Glass Notes */}
            <SoulNotesSection />

            {/* Refined Liquid Filter Controls */}
            <div className="messages-filter-group">
              {['All', 'Personal', 'Groups'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`messages-filter-pill ${tabFilter === tab ? 'active' : ''}`}
                  onClick={() => setTabFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll List (Floating Liquid Rows) */}
          <div className="messages-list-scroll">
            {filteredConversations.map((conv) => {
              return (
                <div
                  key={conv.id}
                  id={`chat-item-${conv.id}`}
                  className="chat-conversation-item"
                  onClick={() => handleSelectChat(conv)}
                >
                  {/* Chat Avatar with Liquid Edge Highlight & Integrated Online Dot */}
                  <div className="chat-row-avatar-wrapper">
                    <img
                      src={
                        (conv.is_channel || conv.isChannel) && (conv.owner_user_id === currentUser?.id || !conv.owner_user_id)
                          ? (currentUser?.avatar_url || conv.partner_avatar)
                          : (conv.partner_avatar ||
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
                      }
                      alt={conv.partner_name}
                      className="chat-row-avatar-img"
                    />
                    <div className="chat-row-online-dot" />
                  </div>

                  {/* Clean Content Hierarchy */}
                  <div className="chat-row-info">
                    <div className="chat-row-top">
                      <div className="chat-row-name-wrap">
                        <span className="chat-row-name">
                          {conv.partner_name}
                        </span>
                        {conv.pinned && (
                          <Pin size={11} className="chat-row-pinned-icon" title="Pinned in inbox" />
                        )}
                        {(conv.is_channel || conv.isChannel) && (
                          <span className="chat-row-badge-pill channel">Channel</span>
                        )}
                        {(conv.is_group || conv.isGroup) && !(conv.is_channel || conv.isChannel) && (
                          <span className="chat-row-badge-pill group">Group</span>
                        )}
                      </div>
                      <span className="chat-row-time">
                        {conv.last_message_time || '10:45'}
                      </span>
                    </div>
                    <div className="chat-row-preview">
                      {conv.last_message || 'Hey there!'}
                    </div>
                  </div>

                  {/* Refined Liquid Unread Badge */}
                  {conv.unread_count > 0 && (
                    <span className="chat-row-unread-badge">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================
          STAGE 2 — INDIVIDUAL CHAT VIEW (COMPLETE LIQUID UI)
          =================================================== */}
      {showChat && (
        <div className={`liquid-glass-panel individual-chat-stage ${chatTransitionClass}`}>
          {/* Full-area fixed theme environment for Broadcast Channels */}
          {(activeConversation?.is_channel || activeConversation?.isChannel) &&
            (activeConversation?.custom_wallpaper || activeConversation?.wallpaper_url || activeConversation?.theme_color) && (
              <div className="channel-theme-environment-wrap" aria-hidden="true">
                <div
                  className="channel-theme-backdrop"
                  style={{
                    backgroundImage: (activeConversation?.custom_wallpaper || activeConversation?.wallpaper_url)
                      ? `url("${activeConversation.custom_wallpaper || activeConversation.wallpaper_url}")`
                      : activeConversation?.theme_color && activeConversation.theme_color.includes('gradient')
                      ? activeConversation.theme_color
                      : undefined,
                    backgroundColor:
                      !activeConversation?.custom_wallpaper &&
                      !activeConversation?.wallpaper_url &&
                      activeConversation?.theme_color &&
                      !activeConversation.theme_color.includes('gradient')
                        ? activeConversation.theme_color
                        : undefined,
                    filter:
                      activeConversation?.custom_wallpaper || activeConversation?.wallpaper_url
                        ? 'blur(0.5px) brightness(0.68) saturate(1.15)'
                        : 'none',
                    opacity:
                      activeConversation?.custom_wallpaper || activeConversation?.wallpaper_url
                        ? 0.88
                        : 0.95
                  }}
                />
                <div className="channel-theme-atmospheric-glow" />
                <div className="channel-theme-mask-top" />
                <div className="channel-theme-mask-bottom" />
                <div className="channel-theme-mask-sides" />
              </div>
            )}

          {/* Dedicated Liquid Chat Header */}
          <div className="individual-chat-header">
            {/* Left: Back Button + Partner Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="chat-back-btn"
                onClick={handleBackToList}
                aria-label="Back to Messages List"
              >
                <ArrowLeft size={16} />
                <span>Messages</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={
                      (activeConversation?.is_channel || activeConversation?.isChannel) &&
                      (activeConversation?.owner_user_id === currentUser?.id || !activeConversation?.owner_user_id)
                        ? (currentUser?.avatar_url || activeConversation?.partner_avatar)
                        : (activeConversation?.partner_avatar ||
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
                    }
                    alt="Partner avatar"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid rgba(185, 140, 255, 0.55)',
                      boxShadow: '0 0 12px rgba(185, 140, 255, 0.3)'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#79D9FF',
                      border: '2px solid rgba(10, 14, 28, 0.95)',
                      boxShadow: '0 0 6px rgba(121, 217, 255, 0.6)'
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#F5F3F7' }}>
                    {activeConversation?.partner_name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.74rem',
                      color: '#79D9FF'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#79D9FF', boxShadow: '0 0 6px #10b981' }} />
                    <span>Active Now • Soul Frequency 94%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Calling & Info Controls or Channel Settings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {(activeConversation?.is_channel || activeConversation?.isChannel) ? (
                /* Prompt Requirement 1: REMOVE Audio Call & Video Call on Channel page.
                   Provide ONE clean, compact: CHANNEL SETTINGS button/icon. */
                <button
                  className="individual-chat-controls-btn"
                  onClick={() => setChannelSettingsOpen(true)}
                  aria-label="Channel Settings"
                  title="Channel Settings"
                  id="channel-settings-header-btn"
                >
                  <Settings size={16} />
                </button>
              ) : (
                <>
                  <button
                    className="individual-chat-controls-btn"
                    onClick={() => showToast('Calling ' + activeConversation?.partner_name)}
                    aria-label="Voice Call"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    className="individual-chat-controls-btn"
                    onClick={() => showToast('Starting video call with ' + activeConversation?.partner_name)}
                    aria-label="Video Call"
                  >
                    <Video size={16} />
                  </button>
                  <button
                    className="individual-chat-controls-btn"
                    onClick={() => {
                      showToast('Conversation info for ' + activeConversation?.partner_name);
                    }}
                    aria-label="Chat Info"
                  >
                    <Info size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Message Bubble History with Liquid Material Bubble Styling & Full Transparent Scroll Area */}
          <div className="chat-messages-scroll">
            {(activeConversation?.is_channel || activeConversation?.isChannel) && activeChatMessages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center',
                  margin: 'auto'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(121, 217, 255, 0.12)',
                    border: '1px solid rgba(121, 217, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 0 20px rgba(121, 217, 255, 0.2)'
                  }}
                >
                  <Radio size={26} style={{ color: '#79D9FF' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#F5F3F7' }}>
                  {activeConversation?.partner_name}
                </div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '340px',
                    marginTop: '0.45rem',
                    lineHeight: '1.45'
                  }}
                >
                  This is the start of the <strong style={{ color: '#79D9FF' }}>{activeConversation?.partner_name}</strong> broadcast channel.
                  Messages published by the channel owner appear here.
                </div>
              </div>
            ) : (
              activeChatMessages.map((msg, idx) => {
                const isChannelMsg = Boolean(activeConversation?.is_channel || activeConversation?.isChannel);

                if (isChannelMsg) {
                  /* Requirement 4: ALL messages sent by the channel owner MUST appear on the LEFT SIDE.
                     NOT RIGHT SIDE. NOT alternating sides.
                     [PROFILE]  Chrichuzz
                                hi
                  */
                  const ownerAvatar =
                    (currentUser && (msg.sender_id === currentUser.id || activeConversation?.owner_user_id === currentUser.id) && currentUser.avatar_url)
                      ? currentUser.avatar_url
                      : (msg.sender_avatar || activeConversation?.owner_avatar || activeConversation?.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

                  return (
                    <div
                      key={msg.id || idx}
                      className="broadcast-channel-message-row"
                    >
                      <img
                        src={ownerAvatar}
                        alt="Channel Owner"
                        className="broadcast-channel-message-avatar"
                      />
                      <div className="broadcast-channel-message-content">
                        <div className="broadcast-channel-message-meta">
                          <span className="broadcast-channel-message-author">
                            {activeConversation?.partner_name || msg.sender_name || 'Channel'}
                          </span>
                          <span className="broadcast-channel-message-badge">Broadcast</span>
                          <span className="broadcast-channel-message-time">
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </div>
                        <div className="broadcast-channel-message-card">
                          {msg.media_url && (
                            <img
                              src={msg.media_url}
                              alt="Shared media"
                              className="broadcast-channel-message-media"
                            />
                          )}
                          {msg.text && (
                            <div className="broadcast-channel-message-text">{msg.text}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Personal 1-on-1 chats: standard incoming/outgoing bubbles
                const isSelf = msg.sender_id === (currentUser?.id || 1);
                return (
                  <div
                    key={msg.id || idx}
                    className={`chat-bubble ${isSelf ? 'outgoing' : 'incoming'}`}
                  >
                    {msg.media_url && (
                      <img
                        src={msg.media_url}
                        alt="Shared media"
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          marginBottom: msg.text ? '0.5rem' : 0
                        }}
                      />
                    )}
                    {msg.text && <div>{msg.text}</div>}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>

          {/* Dedicated Liquid Message Input Bar */}
          <form
            onSubmit={onSend}
            className="individual-chat-input-bar"
          >
            <button
              type="button"
              className="individual-chat-controls-btn"
              onClick={() => showToast('Voice note recorded')}
              aria-label="Voice Note"
            >
              <Mic size={18} />
            </button>

            <button
              type="button"
              className="individual-chat-controls-btn"
              onClick={() => showToast('Select photo/media to share')}
              aria-label="Attach File"
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              className="messages-search-input"
              placeholder={
                (activeConversation?.is_channel || activeConversation?.isChannel)
                  ? `Broadcast to ${activeConversation?.partner_name || 'channel'}...`
                  : `Message ${activeConversation?.partner_name || ''}...`
              }
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend(e);
                }
              }}
              style={{ flex: 1, padding: '0.82rem 1.2rem', fontSize: '0.92rem' }}
            />

            <button
              type="button"
              className="individual-chat-controls-btn"
              onClick={() => setMessageInput((prev) => prev + ' ✨')}
              aria-label="Add Emoji"
            >
              <Smile size={18} />
            </button>

            <button
              type="submit"
              className="btn-primary-gradient"
              disabled={!messageInput.trim()}
              style={{
                width: '42px',
                height: '42px',
                padding: 0,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: messageInput.trim() ? 1 : 0.65,
                cursor: messageInput.trim() ? 'pointer' : 'default',
                transition: 'opacity 0.2s ease, transform 0.15s ease'
              }}
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* =========================================================
          STAGE 3 — PREMIUM LIQUID GLASS GROUP CHAT & CHANNEL FLOW
          ========================================================= */}
      <MessageEditFlow
        isOpen={editFlowOpen}
        onClose={() => setEditFlowOpen(false)}
        onCreateGroup={handleCreateGroup}
        onCreateChannel={handleCreateChannel}
        availableUsers={availableUsers}
      />

      {/* =========================================================
          STAGE 4 — DEDICATED TRANSPARENT LIQUID GLASS CHANNEL SETTINGS
          ========================================================= */}
      <ChannelSettingsModal
        isOpen={channelSettingsOpen}
        onClose={() => setChannelSettingsOpen(false)}
        channel={activeConversation}
        onChannelUpdated={(updated) => {
          setSelectedConv((prev) => (prev ? { ...prev, ...updated } : prev));
          if (setConversations) {
            setConversations((prev) =>
              prev.map((c) =>
                (c.channel_id && c.channel_id === updated.channel_id) || c.id === updated.channel_id || c.id === updated.id
                  ? { ...c, ...updated }
                  : c
              )
            );
          }
          if (setProfileChannels) {
            setProfileChannels((prev) =>
              prev.map((c) =>
                (c.channel_id && c.channel_id === updated.channel_id) || c.id === updated.channel_id || c.id === updated.id
                  ? { ...c, ...updated }
                  : c
              )
            );
          }
        }}
        onChannelDeleted={async (channelId) => {
          setChannelSettingsOpen(false);
          const ok = await handleDeleteChannel(channelId);
          if (ok) {
            handleBackToList();
          }
        }}
      />
    </div>
  );
};

export default MessagingView;
