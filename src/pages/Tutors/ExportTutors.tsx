import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import SelectField from '../../assets/components/SelectField/SelectField';
import styles from './ManageTutors.module.css';

const ExportTutors: React.FC = () => {
  const [filters, setFilters] = useState({ grado: '', grupo: '' });
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:3307/api/tutors/export', {
        params: filters,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tutores.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      setAlert({ message: 'Error generando PDF', type: 'error' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <h2>Exportar Tutores a PDF</h2>
      
      <div className={styles.filterSection}>
        <SelectField
          name="grado"
          value={filters.grado}
          onChange={(e) => setFilters({ ...filters, grado: e.target.value })}
          options={[
            { value: '', label: 'Todos' },
            ...Array.from({ length: 3 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}°` }))
          ]}
        />

        <SelectField
          name="grupo"
          value={filters.grupo}
          onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
          options={[
            { value: '', label: 'Todos' },
            ...'ABCDEFGH'.split('').map(letter => ({ value: letter, label: letter }))
          ]}
        />
      </div>

      <button onClick={handleExport} className={styles.exportButton}>
        Generar PDF
      </button>
    </motion.div>
  );
};

export default ExportTutors;