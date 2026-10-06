import React, { useState } from 'react';
import SoulEmblem from '../common/SoulEmblem';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginScreen = () => {
  const { navigateTo, setCurrentUser, showToast } = useApp();
  const [usernameOrEmail, setUsernameOrEmail] = useState('christon@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(usernameOrEmail, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast(`Welcome back, ${res.user.name}!`);
        navigateTo('home');
      } else {
        showToast(res.message || 'Invalid credentials');
      }
    } catch (err) {
      showToast('Connection error with SQL server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-screen-stage"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 10
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1050px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left Side: Brand & Soulful Quote */}
        <div style={{ textAlign: 'left', paddingLeft: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
            <SoulEmblem size={52} />
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F5F3F7' }}>Soul Sync</span>
          </div>

          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#F5F3F7',
              marginBottom: '1rem'
            }}
          >
            "Better People<br />Create Better Connections."
          </h2>

          <p style={{ color: '#A9ADBC', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '380px' }}>
            Enter a mindful liquid space designed for authentic resonance, shared perspectives, and creative harmony.
          </p>
        </div>

        {/* Right Side: Welcome Back Glass Card */}
        <div className="liquid-glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.45rem' }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.5rem' }}>
                Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="glass-input-field"
                  placeholder="Enter your username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Mail size={17} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="glass-input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <Lock size={17} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.95rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A9ADBC', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.6rem', fontSize: '0.84rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#A9ADBC' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#B83268' }}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Password reset link sent to your registered email.')}
                style={{ background: 'none', border: 'none', color: '#B98CFF', cursor: 'pointer', fontSize: 'inherit' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-primary-gradient"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Login'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Social login divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '1.75rem 0', color: '#A9ADBC', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(185, 140, 255, 0.18)' }} />
            <span>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(185, 140, 255, 0.18)' }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.75rem' }}>
            {['Google', 'Apple', 'Instagram'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="btn-secondary-glass"
                onClick={() => {
                  showToast(`Connected with ${provider}`);
                  navigateTo('home');
                }}
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.6rem 0.5rem' }}
              >
                <span>{provider}</span>
              </button>
            ))}
          </div>

          {/* Bottom create account link */}
          <div style={{ textAlign: 'center', fontSize: '0.86rem', color: '#A9ADBC' }}>
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigateTo('register')}
              style={{ background: 'none', border: 'none', color: '#B83268', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
