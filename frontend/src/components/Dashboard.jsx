import React, { useState, useEffect } from 'react';
import {
  Home,
  Clock,
  Image as ImageIcon,
  BookOpen,
  Heart,
  Archive,
  Bell,
  Search,
  User,
  Crown,
  Settings,
  LogOut,
  RefreshCw,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

export default function Dashboard({
  onOpenSplash,
  onOpenOnboarding,
  onOpenSwagger,
  onOpenCapture,
  onOpenTimeline,
  onOpenJournal,
  onOpenPartner,
  onOpenCapsule,
  onOpenFeelings,
  onOpenGallery,
  onOpenSearch,
  onOpenProfile,
  onOpenSettings,
  onOpenAuth,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('Home');
  const [stats, setStats] = useState({ memories: 4, journal: 2, capsules: 2 });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => {
        setStats({
          memories: data.total_memories || 4,
          journal: data.total_journal_entries || 2,
          capsules: data.total_time_capsules || 2
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Timeline') onOpenTimeline();
    else if (tabName === 'Gallery') onOpenGallery();
    else if (tabName === 'Journal') onOpenJournal();
    else if (tabName === 'Partner Space') onOpenPartner();
    else if (tabName === 'Time Capsule') onOpenCapsule();
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Left Dark Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          {/* Brand Emblem & Name */}
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <svg viewBox="0 0 100 100" width="22" height="22" fill="none">
                <path
                  d="M50 78 C25 56 16 42 16 30 C16 19 25 12 35 12 C42 12 47 16 50 21 C53 16 58 12 65 12 C75 12 84 19 84 30 C84 42 75 56 50 78 Z"
                  stroke="#FFFFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="38" cy="32" r="5" fill="#FFFFFF" />
                <circle cx="62" cy="32" r="5" fill="#FFFFFF" />
                <path d="M40 50 Q50 56 60 50" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <span className="brand-text">SOUL SYNC</span>
          </div>

          {/* Navigation Items */}
          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item ${activeTab === 'Home' ? 'active' : ''}`}
              onClick={() => handleNavClick('Home')}
            >
              <Home size={18} className="nav-icon" />
              <span>Home</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'Timeline' ? 'active' : ''}`}
              onClick={() => handleNavClick('Timeline')}
            >
              <Clock size={18} className="nav-icon" />
              <span>Timeline</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'Gallery' ? 'active' : ''}`}
              onClick={() => handleNavClick('Gallery')}
            >
              <ImageIcon size={18} className="nav-icon" />
              <span>Gallery</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'Journal' ? 'active' : ''}`}
              onClick={() => handleNavClick('Journal')}
            >
              <BookOpen size={18} className="nav-icon" />
              <span>Journal</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'Partner Space' ? 'active' : ''}`}
              onClick={() => handleNavClick('Partner Space')}
            >
              <Heart size={18} className="nav-icon" />
              <span>Partner Space</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'Time Capsule' ? 'active' : ''}`}
              onClick={() => handleNavClick('Time Capsule')}
            >
              <Archive size={18} className="nav-icon" />
              <span>Time Capsule</span>
            </button>
          </nav>
        </div>

        {/* Subscription Bottom Badge */}
        <div className="sidebar-bottom-subscription">
          <div className="subscription-card" onClick={onOpenProfile} style={{ cursor: 'pointer' }}>
            <div className="label">SUBSCRIPTION</div>
            <div className="tier">Premium Member</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Top Header Controls */}
        <div className="dashboard-top-bar">
          <button className="explore-feelings-pill" onClick={onOpenFeelings}>
            EXPLORE YOUR FEELINGS
          </button>

          <div style={{ position: 'relative' }}>
            <button
              className="icon-action-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="bell-badge"></span>
            </button>

            {notificationsOpen && (
              <div style={{
                position: 'absolute',
                top: 30,
                right: 0,
                width: 280,
                background: '#FFFFFF',
                borderRadius: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                border: '1px solid #E2E8F0',
                padding: 16,
                zIndex: 100
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>
                  RECENT ALERTS
                </div>
                <div style={{ fontSize: '12px', color: '#0F172A', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  ✨ Memory Restored: "The Golden Hour Picnic"
                </div>
                <div style={{ fontSize: '12px', color: '#0F172A', padding: '6px 0' }}>
                  ❤️ Heartbeat pulse received from Alex
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="user-profile-badge" onClick={onOpenProfile}>
            <div className="user-meta-text">
              <div className="user-name">Nanba</div>
              <div className="user-role">MEMBER</div>
            </div>
            <div className="user-avatar-box">
              <User size={20} color="#FFFFFF" />
            </div>
          </div>
        </div>

        {/* Dashboard Title & Revision Block */}
        <div className="dashboard-header-block">
          <div className="brand-label-box">
            <span>SOUL SYNC</span>
          </div>

          <div className="dashboard-title-row">
            <h1 className="dashboard-title-text">DASHBOARD</h1>
            <div className="dashboard-revision-tag">
              <div className="rev-no">REVISION 2.04</div>
              <div className="rev-sub">Mapping logical flow & interaction nodes</div>
            </div>
          </div>
        </div>

        {/* Interaction Flow Nodes Banner */}
        <section className="nodes-flow-section">
          <div className="entry-point-tag">
            ENTRY POINT
          </div>

          {/* Node 1: Splash */}
          <div className="node-card" onClick={onOpenSplash}>
            <div className="node-card-header">
              <RefreshCw size={16} color="#08101E" />
              <h3 className="node-card-title">Splash</h3>
            </div>
            <p className="node-card-desc">
              Initial brand immersion and application hydration state.
            </p>
          </div>

          <div className="node-arrow">
            <ArrowRight size={22} />
          </div>

          {/* Node 2: Login / Sign Up */}
          <div className="node-card" onClick={onOpenAuth}>
            <div className="node-card-header">
              <Lock size={16} color="#08101E" />
              <h3 className="node-card-title">Login / Sign Up</h3>
            </div>
            <p className="node-card-desc">
              Identity verification and credential management gateway.
            </p>
          </div>
        </section>

        {/* HOME DASHBOARD Subheading */}
        <h2 className="home-dash-heading">HOME DASHBOARD</h2>

        {/* Core Grid: Main Engine Hero Card + 4 Action Quad Cards */}
        <div className="dash-core-grid">
          {/* Main Engine: Capture Memory Hero Card */}
          <div className="main-engine-hero-card" onClick={onOpenCapture}>
            <div>
              <div className="engine-eyebrow-line">MAIN ENGINE</div>
              <h3 className="engine-title">CAPTURE MEMORY</h3>
              <p className="engine-description">
                The primary ingestion point for archival data and sensory input.
              </p>
            </div>

            <div className="active-state-badge">
              <span className="pulsing-amber-dot"></span>
              <span>Active State: High Priority</span>
            </div>
          </div>

          {/* 4 Action Cards Grid */}
          <div className="dash-quad-grid">
            {/* 1. Timeline */}
            <div className="action-quad-card" onClick={onOpenTimeline}>
              <Clock size={22} className="quad-card-icon" />
              <div>
                <h4 className="quad-card-title">Timeline</h4>
                <p className="quad-card-meta">CHRONOLOGICAL VIEW</p>
              </div>
            </div>

            {/* 2. Journal */}
            <div className="action-quad-card" onClick={onOpenJournal}>
              <BookOpen size={22} className="quad-card-icon" />
              <div>
                <h4 className="quad-card-title">Journal</h4>
                <p className="quad-card-meta">NARRATIVE LOGS</p>
              </div>
            </div>

            {/* 3. Partner Space */}
            <div className="action-quad-card" onClick={onOpenPartner}>
              <Heart size={22} className="quad-card-icon" />
              <div>
                <h4 className="quad-card-title">Partner Space</h4>
                <p className="quad-card-meta">SHARED REPOSITORY</p>
              </div>
            </div>

            {/* 4. Time Capsule */}
            <div className="action-quad-card" onClick={onOpenCapsule}>
              <Archive size={22} className="quad-card-icon" />
              <div>
                <h4 className="quad-card-title">Time Capsule</h4>
                <p className="quad-card-meta">SCHEDULED RELEASE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar (5 Buttons) */}
        <div className="quick-action-bar">
          <button className="quick-pill-btn" onClick={onOpenGallery}>
            <ImageIcon size={16} />
            <span>GALLERY</span>
          </button>

          <button className="quick-pill-btn" onClick={onOpenSearch}>
            <Search size={16} />
            <span>SEARCH</span>
          </button>

          <button className="quick-pill-btn" onClick={() => setNotificationsOpen(true)}>
            <Bell size={16} />
            <span>NOTIFICATIONS</span>
          </button>

          <button className="quick-pill-btn" onClick={onOpenProfile}>
            <User size={16} />
            <span>PROFILE</span>
          </button>

          <button className="quick-pill-btn gold-premium" onClick={onOpenProfile}>
            <Crown size={16} />
            <span>PREMIUM</span>
          </button>
        </div>

        {/* Bottom Row: Settings Card + Log Out Danger Card */}
        <div className="dash-bottom-row">
          {/* Settings Card */}
          <div className="settings-action-card" onClick={onOpenSettings}>
            <div className="settings-icon-box">
              <Settings size={22} />
            </div>
            <div>
              <h4 className="settings-info-title">Settings</h4>
              <p className="settings-info-desc">
                Global configuration, privacy controls, and hardware integration.
              </p>
            </div>
          </div>

          {/* Log Out Danger Card */}
          <div className="logout-action-card" onClick={onLogout}>
            <LogOut size={22} className="logout-icon" />
            <span className="logout-text">LOG OUT</span>
            <div className="logout-line"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
