import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  Users,
  Radio,
  Check,
  Search,
  Sparkles,
  ChevronRight,
  Pin
} from 'lucide-react';

/**
 * LiquidSwitch — Custom Liquid-Glass ON/OFF Toggle Switch
 */
const LiquidSwitch = ({ checked, onChange, id, ariaLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-label={ariaLabel}
      aria-checked={checked}
      className={`liquid-switch-btn ${checked ? 'checked' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="liquid-switch-thumb" />
    </button>
  );
};

/**
 * MessageEditFlow — Premium Liquid-Glass Group Chat + Channel Creation Flow
 *
 * Sequence:
 * 1. Action Menu: Group Chat | Create a Channel
 * 2. Group Chat Flow: Group Name + Select Members + Create Group
 * 3. Channel Creation Flow: Channel Name + Audience (No IG option) + 3 Toggles + Create
 */
const MessageEditFlow = ({
  isOpen,
  onClose,
  onCreateGroup,
  onCreateChannel,
  availableUsers = []
}) => {
  const [viewMode, setViewMode] = useState('menu'); // 'menu' | 'group' | 'channel'
  const [isClosing, setIsClosing] = useState(false);

  // Group state
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Channel state
  const [channelName, setChannelName] = useState('');
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [audienceSearchQuery, setAudienceSearchQuery] = useState('');
  const [pinInInbox, setPinInInbox] = useState(false);
  const [showOnProfile, setShowOnProfile] = useState(false);
  const [allowReplies, setAllowReplies] = useState(false);

  // Reset or close with fluid exit
  const handleExit = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setViewMode('menu');
      if (callback) callback();
      if (onClose) onClose();
    }, 280);
  };

  const handleBackToMenu = () => {
    setViewMode('menu');
  };

  // Group Member Selection Toggle
  const toggleGroupMember = (userId) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Channel Audience Selection Toggle
  const toggleAudienceMember = (userId) => {
    setSelectedAudience((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllAudience = () => {
    if (selectedAudience.length === availableUsers.length) {
      setSelectedAudience([]);
    } else {
      setSelectedAudience(availableUsers.map((u) => u.id));
    }
  };

  // Filtered lists
  const filteredGroupUsers = useMemo(() => {
    return availableUsers.filter((u) =>
      (u.name || '').toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(groupSearchQuery.toLowerCase())
    );
  }, [availableUsers, groupSearchQuery]);

  const filteredAudienceUsers = useMemo(() => {
    return availableUsers.filter((u) =>
      (u.name || '').toLowerCase().includes(audienceSearchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(audienceSearchQuery.toLowerCase())
    );
  }, [availableUsers, audienceSearchQuery]);

  // Handle Create Group Submission
  const handleFinalizeGroup = () => {
    const finalName = groupName.trim() || 'Soul Collective';
    const chosenMembers = availableUsers.filter((u) =>
      selectedGroupMembers.includes(u.id)
    );
    handleExit(() => {
      onCreateGroup({
        name: finalName,
        members: chosenMembers
      });
    });
  };

  // Handle Create Channel Submission
  const handleFinalizeChannel = () => {
    const finalName = channelName.trim() || 'Soul Broadcast';
    const chosenAudience = availableUsers.filter((u) =>
      selectedAudience.includes(u.id)
    );
    handleExit(() => {
      onCreateChannel({
        name: finalName,
        audience: chosenAudience,
        isPinned: pinInInbox,
        showOnProfile,
        allowReplies
      });
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`message-edit-flow-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleExit();
      }}
    >
      <div className={`message-edit-flow-modal ${isClosing ? 'closing' : ''}`}>
        {/* Glow ambient background pill */}
        <div className="message-edit-modal-glow" />

        {/* =========================================================
            STAGE 1: EDIT ACTION MENU
            ========================================================= */}
        {viewMode === 'menu' && (
          <div className="message-edit-step-container">
            <div className="message-edit-modal-header">
              <div>
                <h3 className="message-edit-modal-title">New Conversation</h3>
                <p className="message-edit-modal-subtitle">
                  Select a format to start resonating
                </p>
              </div>
              <button
                type="button"
                className="message-edit-close-btn"
                onClick={() => handleExit()}
                aria-label="Close menu"
              >
                <X size={17} />
              </button>
            </div>

            <div className="message-edit-options-list">
              {/* Option 1: Group Chat */}
              <button
                type="button"
                className="message-edit-option-card"
                onClick={() => setViewMode('group')}
              >
                <div className="message-edit-option-icon-wrap group-icon">
                  <Users size={22} />
                </div>
                <div className="message-edit-option-info">
                  <span className="message-edit-option-title">Group Chat</span>
                  <span className="message-edit-option-desc">
                    Connect and resonate with multiple souls in a shared space
                  </span>
                </div>
                <ChevronRight size={18} className="message-edit-option-chevron" />
              </button>

              {/* Option 2: Create a Channel */}
              <button
                type="button"
                className="message-edit-option-card"
                onClick={() => setViewMode('channel')}
              >
                <div className="message-edit-option-icon-wrap channel-icon">
                  <Radio size={22} />
                </div>
                <div className="message-edit-option-info">
                  <span className="message-edit-option-title">Create a Channel</span>
                  <span className="message-edit-option-desc">
                    Broadcast thoughts, music, and energy to your chosen audience
                  </span>
                </div>
                <ChevronRight size={18} className="message-edit-option-chevron" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STAGE 2: GROUP CHAT FLOW
            ========================================================= */}
        {viewMode === 'group' && (
          <div className="message-edit-step-container">
            <div className="message-edit-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="message-edit-back-btn"
                  onClick={handleBackToMenu}
                  aria-label="Back to menu"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="message-edit-modal-title">New Group Chat</h3>
                  <p className="message-edit-modal-subtitle">
                    Set a collective name and choose members
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="message-edit-close-btn"
                onClick={() => handleExit()}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="message-edit-scroll-body">
              {/* Group Name Field */}
              <div className="message-edit-field-group">
                <label className="message-edit-field-label">Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name (e.g. Celestial Collective)..."
                  className="message-edit-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Members Section Header */}
              <div className="message-edit-section-header">
                <span className="message-edit-section-tag">MEMBERS</span>
                <span className="message-edit-count-badge">
                  {selectedGroupMembers.length} selected
                </span>
              </div>

              {/* Member Search Bar */}
              <div className="message-edit-search-wrap">
                <input
                  type="text"
                  placeholder="Search followers..."
                  className="message-edit-search-input"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                />
                <Search size={14} className="message-edit-search-icon" />
              </div>

              {/* Selectable Member List */}
              <div className="message-edit-users-list">
                {filteredGroupUsers.map((user) => {
                  const isSelected = selectedGroupMembers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`message-edit-user-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleGroupMember(user.id)}
                    >
                      <div className="message-edit-user-avatar-wrap">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="message-edit-user-avatar"
                        />
                      </div>
                      <div className="message-edit-user-info">
                        <div className="message-edit-user-name">{user.name}</div>
                        <div className="message-edit-user-handle">@{user.username}</div>
                      </div>
                      <div className={`message-edit-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={13} color="#F5F3F7" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer / Create Group Action */}
            <div className="message-edit-modal-footer">
              <button
                type="button"
                className="message-edit-submit-btn"
                disabled={selectedGroupMembers.length === 0}
                onClick={handleFinalizeGroup}
              >
                <span>Create Group</span>
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STAGE 3: CREATE A CHANNEL FLOW
            ========================================================= */}
        {viewMode === 'channel' && (
          <div className="message-edit-step-container">
            <div className="message-edit-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="message-edit-back-btn"
                  onClick={handleBackToMenu}
                  aria-label="Back to menu"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="message-edit-modal-title">Create a Channel</h3>
                  <p className="message-edit-modal-subtitle">
                    Broadcast space for your chosen audience
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="message-edit-close-btn"
                onClick={() => handleExit()}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="message-edit-scroll-body">
              {/* A. Channel Name */}
              <div className="message-edit-field-group">
                <label className="message-edit-field-label">Channel Name</label>
                <input
                  type="text"
                  placeholder="Enter channel name"
                  className="message-edit-input"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* B. Audience */}
              <div className="message-edit-field-group">
                <div className="message-edit-section-header">
                  <span className="message-edit-section-tag">AUDIENCE</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="message-edit-count-badge">
                      {selectedAudience.length} members selected
                    </span>
                    <button
                      type="button"
                      className="message-edit-action-link"
                      onClick={handleSelectAllAudience}
                    >
                      {selectedAudience.length === availableUsers.length ? 'Clear' : 'Select All'}
                    </button>
                  </div>
                </div>

                {/* Audience Search */}
                <div className="message-edit-search-wrap">
                  <input
                    type="text"
                    placeholder="Search followers..."
                    className="message-edit-search-input"
                    value={audienceSearchQuery}
                    onChange={(e) => setAudienceSearchQuery(e.target.value)}
                  />
                  <Search size={14} className="message-edit-search-icon" />
                </div>

                {/* Selectable Audience List (Strictly NO Instagram option) */}
                <div className="message-edit-users-list" style={{ maxHeight: '160px' }}>
                  {filteredAudienceUsers.map((user) => {
                    const isSelected = selectedAudience.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        className={`message-edit-user-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleAudienceMember(user.id)}
                      >
                        <div className="message-edit-user-avatar-wrap">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="message-edit-user-avatar"
                          />
                        </div>
                        <div className="message-edit-user-info">
                          <div className="message-edit-user-name">{user.name}</div>
                          <div className="message-edit-user-handle">@{user.username}</div>
                        </div>
                        <div className={`message-edit-checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={13} color="#F5F3F7" strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggles Container */}
              <div className="message-edit-toggles-container">
                {/* C. Pin channel in inbox */}
                <div className="message-edit-toggle-row">
                  <div className="message-edit-toggle-text">
                    <div className="message-edit-toggle-label-row">
                      <Pin size={13} color="#B98CFF" />
                      <span className="message-edit-toggle-label">
                        Pin channel in inbox
                      </span>
                    </div>
                    <span className="message-edit-toggle-sub">
                      Keep this channel pinned at the very top of your inbox
                    </span>
                  </div>
                  <LiquidSwitch
                    id="pin-inbox-switch"
                    ariaLabel="Pin channel in inbox"
                    checked={pinInInbox}
                    onChange={setPinInInbox}
                  />
                </div>

                {/* D. Show channel on profile */}
                <div className="message-edit-toggle-row">
                  <div className="message-edit-toggle-text">
                    <div className="message-edit-toggle-label-row">
                      <Sparkles size={13} color="#79D9FF" />
                      <span className="message-edit-toggle-label">
                        Show channel on profile
                      </span>
                    </div>
                    <span className="message-edit-toggle-sub">
                      Display this broadcast channel publicly on your profile
                    </span>
                  </div>
                  <LiquidSwitch
                    id="show-profile-switch"
                    ariaLabel="Show channel on profile"
                    checked={showOnProfile}
                    onChange={setShowOnProfile}
                  />
                </div>

                {/* E. Allow members to reply to messages */}
                <div className="message-edit-toggle-row">
                  <div className="message-edit-toggle-text">
                    <div className="message-edit-toggle-label-row">
                      <Radio size={13} color="#B83268" />
                      <span className="message-edit-toggle-label">
                        Allow members to reply to messages
                      </span>
                    </div>
                    <span className="message-edit-toggle-sub">
                      {allowReplies
                        ? 'Audience members can respond to your channel messages'
                        : 'Broadcast only: only channel owner can send messages'}
                    </span>
                  </div>
                  <LiquidSwitch
                    id="allow-replies-switch"
                    ariaLabel="Allow members to reply to messages"
                    checked={allowReplies}
                    onChange={setAllowReplies}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer / Create Channel Action */}
            <div className="message-edit-modal-footer">
              <button
                type="button"
                className="message-edit-submit-btn"
                disabled={!channelName.trim()}
                onClick={handleFinalizeChannel}
              >
                <span>Create</span>
                <Radio size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageEditFlow;
