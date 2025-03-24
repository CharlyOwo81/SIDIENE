import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import Button from '../../assets/components/Button/Button';
import Label from '../../assets/components/Label/Label';
import SelectField from '../../assets/components/SelectField/SelectField'; // Import SelectField
import GoBackButton from '../../assets/components/Button/GoBackButton';
import styles from './QueryStudents.module.css';

interface StudentQueryFormProps {
  searchQuery: string;
  filters: {
    grado: string[];
    grupo: string[];
    anio_ingreso: string[];
  };
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const QueryStudentForm: React.FC<StudentQueryFormProps> = ({
  searchQuery,
  filters,
  handleSearchChange,
  handleFilterChange,
  handleSubmit,
}) => {
  const gradoOptions = [
    { value: '', label: 'Todos' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ];

  const grupoOptions = [
    { value: '', label: 'Todos' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={styles.queryContainer}
    >
      <form onSubmit={handleSubmit} className={styles.queryForm}>
        <div className={styles.inputGroup}>
          <Label htmlFor="search">Buscar por Nombre o CURP</Label>
          <motion.input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Nombre, CURP, etc."
            className={styles.searchInput}
            whileFocus={{ scale: 1.02, borderColor: '#F3C44D' }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <Label htmlFor="grado">Grado</Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <SelectField
                id="grado"
                name="grado"
                multiple
                value={filters.grado}
                onChange={handleFilterChange}
                options={gradoOptions}
                className={styles.filterSelect}
              />
            </motion.div>
          </div>

          <div className={styles.filterGroup}>
            <Label htmlFor="grupo">Grupo</Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <SelectField
                id="grupo"
                name="grupo"
                multiple
                value={filters.grupo}
                onChange={handleFilterChange}
                options={grupoOptions}
                className={styles.filterSelect}
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className={styles.buttonWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button type="submit">Buscar</Button>
          <GoBackButton />
        </motion.div>
      </form>
    </motion.div>
  );
};

export default QueryStudentForm;