import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import OnboardingStep1 from './components/OnboardingStep1';
import OnboardingStep2 from './components/OnboardingStep2';
import OnboardingStep3 from './components/OnboardingStep3';
import Dashboard from './components/Dashboard';

import CaptureMemoryModal from './components/CaptureMemoryModal';
import TimelineModal from './components/TimelineModal';
import JournalModal from './components/JournalModal';
import PartnerSpaceModal from './components/PartnerSpaceModal';
import TimeCapsuleModal from './components/TimeCapsuleModal';
import FeelingsModal from './components/FeelingsModal';
import GalleryModal from './components/GalleryModal';
import SearchModal from './components/SearchModal';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import SwaggerDocsModal from './components/SwaggerDocsModal';

import { Sparkles, Code2, Play } from 'lucide-react';

export default function App() {
  // Current main view: 'splash', 'step1', 'step2', 'step3', 'dashboard'
  const [currentView, setCurrentView] = useState('splash');

  // Modals state
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);
  const [isFeelingsOpen, setIsFeelingsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSwaggerOpen, setIsSwaggerOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to end your encrypted session?')) {
      fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
        setCurrentView('splash');
      });
    }
  };

  return (
    <div className="app-viewport">
      {/* Top Floating View Switcher Bar (Directly inspect all 5 screens and live Swagger) */}
      <div className="view-switcher-bar">
        <button
          className={`view-btn ${currentView === 'splash' ? 'active' : ''}`}
          onClick={() => setCurrentView('splash')}
        >
          🌸 Splash
        </button>
        <button
          className={`view-btn ${currentView === 'step1' ? 'active' : ''}`}
          onClick={() => setCurrentView('step1')}
        >
          01 Intro
        </button>
        <button
          className={`view-btn ${currentView === 'step2' ? 'active' : ''}`}
          onClick={() => setCurrentView('step2')}
        >
          02 Personalize
        </button>
        <button
          className={`view-btn ${currentView === 'step3' ? 'active' : ''}`}
          onClick={() => setCurrentView('step3')}
        >
          03 Connect
        </button>
        <button
          className={`view-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          ⚡ Dashboard
        </button>
        <button
          className="view-btn swagger-badge-btn"
          onClick={() => setIsSwaggerOpen(true)}
          title="Open FastAPI Swagger Interactive Docs"
        >
          <Code2 size={13} />
          <span>Swagger API</span>
        </button>
      </div>

      {/* Screen Views Routing */}
      {currentView === 'splash' && (
        <SplashScreen
          onNext={() => setCurrentView('step1')}
          onDirectDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'step1' && (
        <OnboardingStep1
          onNext={() => setCurrentView('step2')}
          onSkip={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'step2' && (
        <OnboardingStep2
          onNext={() => setCurrentView('step3')}
          onSkip={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'step3' && (
        <OnboardingStep3
          onGetStarted={() => setCurrentView('dashboard')}
          onOpenGallery={() => setIsGalleryOpen(true)}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          onOpenSplash={() => setCurrentView('splash')}
          onOpenOnboarding={() => setCurrentView('step1')}
          onOpenSwagger={() => setIsSwaggerOpen(true)}
          onOpenCapture={() => setIsCaptureOpen(true)}
          onOpenTimeline={() => setIsTimelineOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenPartner={() => setIsPartnerOpen(true)}
          onOpenCapsule={() => setIsCapsuleOpen(true)}
          onOpenFeelings={() => setIsFeelingsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Modals & Feature Drawers */}
      <CaptureMemoryModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onMemoryCreated={() => {}}
      />
      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
      <PartnerSpaceModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
      />
      <TimeCapsuleModal
        isOpen={isCapsuleOpen}
        onClose={() => setIsCapsuleOpen(false)}
      />
      <FeelingsModal
        isOpen={isFeelingsOpen}
        onClose={() => setIsFeelingsOpen(false)}
      />
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={() => {}}
      />
      <SwaggerDocsModal
        isOpen={isSwaggerOpen}
        onClose={() => setIsSwaggerOpen(false)}
      />
    </div>
  );
}
