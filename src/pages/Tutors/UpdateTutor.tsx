import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageTutors.module.css';
import TutorForm from './TutorForm';

const UpdateTutor: React.FC = () => {
  const { curp } = useParams<{ curp: string }>();
  const [tutor, setTutor] = useState<any>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(`http://localhost:3307/api/tutors/${curp}`);
        setTutor(response.data.data);
      } catch (error) {
        setAlert({ message: 'Error cargando tutor', type: 'error' });
      }
    };
    fetchTutor();
  }, [curp]);

  const handleSave = async (updatedData: any) => {
    try {
      const response = await axios.put(`http://localhost:3307/api/tutors/${curp}`, updatedData);
      setAlert({ message: response.data.message, type: 'success' });
    } catch (error) {
      setAlert({ message: 'Error actualizando tutor', type: 'error' });
    }
  };

  if (!tutor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <h2 className={styles.title}>Actualización de Tutor</h2>
      <TutorForm 
        tutor={tutor}
        onSave={handleSave}
        onCancel={() => window.history.back()}
      />
    </motion.div>
  );
};

export default UpdateTutor;