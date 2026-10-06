import React, { useState } from 'react';
import SoulEmblem from '../common/SoulEmblem';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { User, AtSign, Mail, Lock, ArrowRight } from 'lucide-react';

const RegisterScreen = () => {
  const { navigateTo, setTempRegisterEmail, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: 'Christon Thomas',
    username: 'christon',
    email: 'christon@gmail.com',
    password: 'password123',
    agreed: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      showToast('Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register(formData);
      if (res.success) {
        setTempRegisterEmail(formData.email);
        showToast('Account created. Enter the 6-digit verification code.');
        navigateTo('otp'); // Flow to Screen 04: OTP Verification Screen
      } else {
        showToast(res.message || 'Registration failed');
      }
    } catch (err) {
      showToast('Error connecting to registration service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
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
            "Same People.<br />New Stories."
          </h2>

          <p style={{ color: '#A9ADBC', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '380px' }}>
            Begin your journey in a fluid, authentic social space crafted with depth, beauty, and true human presence.
          </p>
        </div>

        {/* Right Side: Create Your Account Glass Card */}
        <div className="liquid-glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.45rem' }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Let's build something beautiful together
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.45rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="glass-input-field"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ paddingLeft: '2.6rem' }}
                />
                <User size={16} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.45rem' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="glass-input-field"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={{ paddingLeft: '2.6rem' }}
                />
                <AtSign size={16} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="glass-input-field"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#A9ADBC', marginBottom: '0.45rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  className="glass-input-field"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#A9ADBC' }} />
              </div>
            </div>

            {/* Terms checkbox */}
            <div style={{ marginBottom: '1.6rem', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', cursor: 'pointer', color: '#A9ADBC' }}>
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  style={{ marginTop: '0.2rem', accentColor: '#B83268' }}
                />
                <span>I agree to the Terms & Conditions and Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-gradient"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Bottom link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.86rem', color: '#A9ADBC' }}>
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigateTo('login')}
              style={{ background: 'none', border: 'none', color: '#B83268', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
