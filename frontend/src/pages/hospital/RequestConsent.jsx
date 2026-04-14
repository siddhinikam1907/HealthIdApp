import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

const RequestConsent = () => {
  const [healthId, setHealthId] = useState('');
  const [otp, setOtp] = useState('');
  const [consentId, setConsentId] = useState('');
  const [devOTP, setDevOTP] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/consent/request', { healthId });
      setConsentId(res.data.consentId);
      setDevOTP(res.data.devOTP || '');
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request consent');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/consent/verify', { consentId, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="glass-panel">
        <h2 className="heading-gradient text-center" style={{ marginBottom: '2rem' }}>
          <FaLock style={{ marginRight: '0.5rem' }} />
          Request Access Consent
        </h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(255, 71, 87, 0.1)', borderRadius: '8px' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

        {step === 1 && (
          <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Patient Health ID</label>
              <input type="text" className="glass-input" value={healthId} onChange={(e) => setHealthId(e.target.value)} required placeholder="e.g. MH-2026-1234" style={{ marginTop: '0.5rem' }} />
            </div>
            <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Sending...' : 'Request Patient Consent'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {devOTP && (
              <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🧪 Dev Mode — Consent OTP</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '4px', color: 'var(--secondary-color)' }}>{devOTP}</p>
              </div>
            )}
            <div className="input-group">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter OTP from Patient</label>
              <input type="text" className="glass-input" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="6-digit OTP" style={{ marginTop: '0.5rem', letterSpacing: '2px' }} />
            </div>
            <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Verifying...' : 'Verify Consent'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center" style={{ marginTop: '1rem' }}>
            <FaCheckCircle style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--success)' }}>Patient Consent Granted!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>You can now upload records or view the patient's medical history.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestConsent;
