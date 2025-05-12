import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './ManageTutors.module.css';
import SelectField from '../../assets/components/SelectField/SelectField';
import InputField from '../../assets/components/InputField/InputField';
import Button from '../../assets/components/Button/Button';

interface StudentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (student: any) => void;
}

const StudentSearchModal: React.FC<StudentSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [filters, setFilters] = useState({ grado: '', grupo: '' });

  const searchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3307/api/students', {
        params: {
          searchQuery: searchTerm,
          grado: filters.grado,
          grupo: filters.grupo
        }
      });
      
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error searching students:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      searchStudents();
    }
  }, [isOpen, filters]);

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Buscar Estudiante</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.searchFilters}>
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

          <InputField
          name='searchTerm'
            placeholder='Buscar por CURP o nombre'
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.resultsList}>
          {students.map(student => (
            <div
              key={student.curp}
              className={styles.resultItem}
              onClick={() => {
                onSelect(student);
                onClose();
              }}
            >
              <div className={styles.studentName}>
                {student.nombres} {student.apellido_paterno} {student.apellido_materno}
              </div>
              <div className={styles.studentInfo}>
                {student.grado}° {student.grupo} | CURP: {student.curp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSearchModal;