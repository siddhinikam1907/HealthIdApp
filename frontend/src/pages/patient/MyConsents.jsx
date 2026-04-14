import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const MyConsents = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const res = await api.get('/patient/consents');
        setConsents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch consents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsents();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle style={{ color: 'var(--success)' }} />;
      case 'rejected': return <FaTimesCircle style={{ color: 'var(--danger)' }} />;
      default: return <FaClock style={{ color: '#f1c40f' }} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="heading-gradient" style={{ marginBottom: '2rem' }}>Consent Requests</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>Loading consents...</div>
      ) : consents.length === 0 ? (
        <div className="glass-panel text-center" style={{ color: 'var(--text-secondary)', padding: '3rem' }}>
          No consent requests found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {consents.map((consent, index) => (
            <motion.div 
              key={consent._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{consent.hospitalId?.hospitalName || 'Unknown Hospital'}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requested on: {new Date(consent.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                {getStatusIcon(consent.status)}
                <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{consent.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyConsents;
