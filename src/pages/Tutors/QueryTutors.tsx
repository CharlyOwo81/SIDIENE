import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageTutors.module.css';
import TutorList from './TutorList';

const QueryTutors: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:3307/api/tutor');
        setTutors(response.data.data);
      } catch (error) {
        setAlert({ message: 'Error cargando tutores', type: 'error' });
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(tutor =>
    `${tutor.nombres} ${tutor.apellido_paterno} ${tutor.apellido_materno}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className={styles.header}>
        <h2>Consulta de Tutores</h2>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <TutorList 
        tutors={filteredTutors}
        onEdit={() => {}}
        onDelete={async (curp) => {
          try {
            await axios.delete(`http://localhost:3307/api/tutors/${curp}`);
            setTutors(tutors.filter(t => t.curp !== curp));
          } catch (error) {
            setAlert({ message: 'Error eliminando tutor', type: 'error' });
          }
        }}
      />
    </motion.div>
  );
};

export default QueryTutors;