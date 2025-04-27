import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageTutors.module.css';
import TutorForm from './TutorForm';
import Navbar from '../../assets/components/Navbar/TutorNavbar';
import GoBackButton from '../../assets/components/Button/GoBackButton';

const RegisterTutor: React.FC = () => {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const handleSave = async (tutorData: any) => {
    try {
      const response = await axios.post('http://localhost:3307/api/tutor', tutorData);
      setAlert({ message: response.data.message, type: 'success' });
    } catch (error) {
      setAlert({ message: 'Error registrando tutor', type: 'error' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >

      <Navbar/>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <TutorForm onSave={handleSave} onCancel={() => window.history.back()} />
      
    </motion.div>
  );
};

export default RegisterTutor;