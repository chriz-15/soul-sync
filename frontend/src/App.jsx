import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './components/auth/SplashScreen';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import OtpScreen from './components/auth/OtpScreen';
import Sidebar from './components/layout/Sidebar';
import HomeFeed from './components/feed/HomeFeed';
import MessagingView from './components/messaging/MessagingView';
import ProfileView from './components/profile/ProfileView';
import CreateView from './components/create/CreateView';
import ExploreView from './components/explore/ExploreView';
import NotificationsView from './components/notifications/NotificationsView';
import SettingsView from './components/settings/SettingsView';
import { SavedView, ArchiveView, ReportModal } from './components/additional/AdditionalViews';
import SoulMomentTimeline from './components/moments/SoulMomentTimeline';
import SoulMomentDetail from './components/moments/SoulMomentDetail';
import { Check } from 'lucide-react';
import './components/common/fluidTransition.css';

const AppContent = () => {
  const { currentRoute, reportModalOpen, setReportModalOpen, toastMessage, fluidTransition } = useApp();

  // 1. Auth & Splash Flow (Full Screen Atmospheric Layouts)
  if (currentRoute === 'splash') return <SplashScreen />;
  if (currentRoute === 'login') return <LoginScreen />;
  if (currentRoute === 'register') return <RegisterScreen />;
  if (currentRoute === 'otp') return <OtpScreen />;

  // 2. Main Web Application (Persistent Liquid Glass Sidebar + Main View)
  return (
    <div className="main-app-container">
      <Sidebar />

      <main className="main-view-area" role="main">
        {currentRoute === 'home' && (
          <div className="soul-home-reveal-container">
            <HomeFeed />
          </div>
        )}
        {currentRoute === 'moments' && <SoulMomentTimeline />}
        {currentRoute === 'messages' && <MessagingView />}
        {currentRoute === 'profile' && (
          <div className="profile-organic-reveal">
            <ProfileView />
          </div>
        )}
        {currentRoute === 'create' && (
          <div
            className={`soul-fluid-page-container ${
              fluidTransition?.phase === 'exiting' ? 'page-fluid-exit' : 'page-fluid-enter'
            }`}
          >
            <CreateView />
          </div>
        )}
        {currentRoute === 'explore' && <ExploreView />}
        {currentRoute === 'notifications' && (
          <div
            className={`soul-fluid-page-container ${
              fluidTransition?.phase === 'exiting' ? 'page-fluid-exit' : 'page-fluid-enter'
            }`}
          >
            <NotificationsView />
          </div>
        )}
        {currentRoute === 'settings' && <SettingsView />}
        {currentRoute === 'saved' && <SavedView />}
        {currentRoute === 'archive' && <ArchiveView />}
      </main>

      {/* Fluid Liquid Transition Shimmer Veil */}
      {fluidTransition?.active && (
        <div
          className={`soul-fluid-transition-veil ${
            fluidTransition.phase === 'exiting' ? 'phase-exiting' : 'phase-entering'
          }`}
          aria-hidden="true"
        >
          <div className="liquid-refraction-sheen" />
          <div className="liquid-ambient-wave wave-1" />
          <div className="liquid-ambient-wave wave-2" />
          <div className="liquid-chromatic-ripple" />
        </div>
      )}

      {/* Soul Moment Detail Modal */}
      <SoulMomentDetail />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 20, 38, 0.95)',
            border: '1px solid rgba(185, 140, 255, 0.18)',
            boxShadow: '0 0 30px rgba(185, 140, 255, 0.22)',
            backdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            padding: '0.65rem 1.4rem',
            color: '#F5F3F7',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            zIndex: 300,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Check size={16} color="#79D9FF" strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      {/* Liquid Glass Atmospheric Ambient Background */}
      <div className="app-atmosphere">
        <div className="ambient-light-orb-1" />
        <div className="ambient-light-orb-2" />
      </div>

      <AppContent />
    </AppProvider>
  );
}

export default App;
