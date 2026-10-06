import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';

const OtpScreen = () => {
  const { navigateTo, tempRegisterEmail, setCurrentUser, showToast } = useApp();
  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [countdown, setCountdown] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto move to next field
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      showToast('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(code, tempRegisterEmail);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast('Email verified! Welcome to Soul Sync.');
        navigateTo('home'); // Enters Main Application (Screen 05)
      } else {
        showToast(res.message || 'Verification failed');
      }
    } catch (err) {
      showToast('Error validating OTP code');
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 10
      }}
    >
      {/* Back button */}
      <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem' }}>
        <button
          className="btn-secondary-glass"
          onClick={() => navigateTo('register')}
          style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Center OTP Card (Screen 04 exact representation) */}
      <div
        className="liquid-glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '3rem 2.5rem',
          textAlign: 'center'
        }}
      >
        {/* Glowing Envelope Icon Beacon */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'rgba(184, 50, 104, 0.15)',
            border: '1.5px solid rgba(185, 140, 255, 0.4)',
            boxShadow: '0 0 35px rgba(184, 50, 104, 0.25), inset 0 0 15px rgba(185, 140, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem'
          }}
        >
          <Mail size={32} color="#B98CFF" />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '0.65rem' }}>
          Verify Your Email
        </h2>

        <p style={{ color: '#A9ADBC', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '2.2rem' }}>
          We've sent a 6-digit code to<br />
          <span style={{ color: '#B98CFF', fontWeight: 600 }}>{tempRegisterEmail || 'christon@gmail.com'}</span>
        </p>

        {/* 6 Digit Inputs */}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', marginBottom: '2.2rem' }}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="glass-input-field"
              style={{
                width: '52px',
                height: '60px',
                fontSize: '1.5rem',
                fontWeight: 700,
                textAlign: 'center',
                borderRadius: '14px',
                background: 'rgba(15, 20, 38, 0.85)',
                borderColor: digit ? '#B83268' : 'var(--glass-border)',
                boxShadow: digit ? '0 0 15px rgba(184, 50, 104, 0.35)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Resend Timer */}
        <div style={{ marginBottom: '2rem', fontSize: '0.88rem', color: '#A9ADBC' }}>
          <span>Didn't receive the code? </span>
          <button
            type="button"
            onClick={() => showToast('New code sent to ' + tempRegisterEmail)}
            style={{ background: 'none', border: 'none', color: '#B98CFF', fontWeight: 600, cursor: 'pointer' }}
          >
            Resend (00:{countdown.toString().padStart(2, '0')})
          </button>
        </div>

        {/* Continue Button */}
        <button
          className="btn-primary-gradient"
          onClick={handleVerify}
          disabled={loading}
          style={{ width: '100%', height: '52px', fontSize: '1.02rem' }}
        >
          <span>{loading ? 'Verifying...' : 'Continue'}</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default OtpScreen;
