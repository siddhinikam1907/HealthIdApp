import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/hospital/patients');
        setPatients(res.data || []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="heading-gradient" style={{ marginBottom: '2rem' }}>Hospital Patient Directory</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>Loading directory...</div>
      ) : patients.length === 0 ? (
        <div className="glass-panel text-center" style={{ color: 'var(--text-secondary)', padding: '3rem' }}>
          No patients in your directory. Try searching for a patient's Health ID to add them.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {patients.map((patient, index) => (
            <motion.div 
              key={patient._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel"
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{patient.patientId?.name || patient.patientName || 'Unknown'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Health ID: {patient.patientId?.healthId || 'N/A'}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Last Visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyPatients;
