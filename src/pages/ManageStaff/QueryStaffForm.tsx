import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../assets/components/InputField/InputField';
import SelectField from '../../assets/components/SelectField/SelectField';
import Button from '../../assets/components/Button/Button';
import styles from './AddStaff.module.css';

interface QueryStaffFormProps {
  searchQuery: string;
  filters: {
    rol: string[];
  };
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const QueryStaffForm: React.FC<QueryStaffFormProps> = ({
  searchQuery,
  filters,
  handleSearchChange,
  handleFilterChange,
  handleSubmit,
}) => {
  const rolOptions = [
    { value: '', label: 'Todos' },
    { value: 'DOCENTE', label: 'Docente' },
    { value: 'PREFECTO', label: 'Prefecto' },
    { value: 'DIRECTIVO', label: 'Directivo' },
    { value: 'TRABAJADOR_SOCIAL', label: 'Trabajador Social' },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={styles.form}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.searchContainer}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <InputField
            type="text"
            placeholder="Buscar personal..."
            value={searchQuery}
            onChange={handleSearchChange}
            name="search"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Button type="submit">Buscar</Button>
        </motion.div>
      </div>

      <div className={styles.filterContainer}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <SelectField
            name="rol"
            options={rolOptions}
            multiple
            value={filters.rol}
            onChange={handleFilterChange}
          />
        </motion.div>
      </div>
    </motion.form>
  );
};

export default QueryStaffForm;