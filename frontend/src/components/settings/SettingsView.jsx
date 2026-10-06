import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Bell,
  MessageSquare,
  Palette,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Check
} from 'lucide-react';

const SettingsView = () => {
  const { navigateTo, showToast, setCurrentUser } = useApp();
  const [privateAccount, setPrivateAccount] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  const settingSections = [
    {
      id: 'account',
      title: 'Account',
      desc: 'Manage your profile details, password, and security',
      icon: User,
      action: () => showToast('Account details updated')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      desc: 'Control visibility, resonance filters, and blocked souls',
      icon: Shield,
      toggle: {
        label: 'Private Account',
        value: privateAccount,
        onChange: () => {
          setPrivateAccount(!privateAccount);
          showToast(!privateAccount ? 'Account set to Private' : 'Account is now Public');
        }
      }
    },
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Tune push alerts, mention pings, and message chimes',
      icon: Bell,
      toggle: {
        label: 'Push Notifications',
        value: pushNotifs,
        onChange: () => {
          setPushNotifs(!pushNotifs);
          showToast(!pushNotifs ? 'Push alerts enabled' : 'Push alerts disabled');
        }
      }
    },
    {
      id: 'messages',
      title: 'Messages',
      desc: 'Manage message requests and read receipts',
      icon: MessageSquare,
      action: () => showToast('Message permissions configured')
    },
    {
      id: 'appearance',
      title: 'Appearance',
      desc: 'Liquid Glass Dark (Active) • Cyan & Magenta accents',
      icon: Palette,
      action: () => showToast('Current theme: Liquid Glass Dark (v2.4)')
    },
    {
      id: 'language',
      title: 'Language',
      desc: 'English (US) — Harmonized across all regions',
      icon: Globe,
      action: () => showToast('Language set to English (US)')
    },
    {
      id: 'support',
      title: 'Help & Support',
      desc: 'Documentation, community guidelines, and support tickets',
      icon: HelpCircle,
      action: () => showToast('Help portal opened')
    },
    {
      id: 'about',
      title: 'About Soul Sync',
      desc: 'v2.4.0 Live • Liquid Android Engine • Built for Deeper Connections',
      icon: Info,
      action: () => showToast('Soul Sync v2.4.0 Live — All nodes operating at 99.8% coherence')
    }
  ];

  return (
    <div className="liquid-glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header (Screen 11 representation) */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '1.75rem' }}>
        Settings
      </h2>

      {/* Settings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {settingSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="liquid-glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.15rem 1.4rem',
                cursor: sec.action ? 'pointer' : 'default'
              }}
              onClick={sec.action ? sec.action : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(245, 243, 247, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} color="#B98CFF" />
                </div>

                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#F5F3F7', marginBottom: '0.2rem' }}>
                    {sec.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {sec.desc}
                  </div>
                </div>
              </div>

              {sec.toggle ? (
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sec.toggle.value}
                    onChange={sec.toggle.onChange}
                    style={{ width: '18px', height: '18px', accentColor: '#B83268' }}
                  />
                </label>
              ) : (
                <ChevronRight size={18} color="var(--text-muted)" />
              )}
            </div>
          );
        })}

        {/* Logout Option */}
        <div
          className="liquid-glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.15rem 1.4rem',
            cursor: 'pointer',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            marginTop: '1rem'
          }}
          onClick={() => {
            localStorage.removeItem('soulsync_token');
            localStorage.removeItem('soulsync_user_id');
            localStorage.removeItem('soul_sync_current_user');
            localStorage.removeItem('soul_sync_profile');
            setCurrentUser(null);
            showToast('Signed out of Soul Sync');
            navigateTo('login');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={20} color="#ef4444" />
            </div>

            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#f87171' }}>
                Logout
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sign out of your Soul Sync session
              </div>
            </div>
          </div>

          <ChevronRight size={18} color="#ef4444" />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
