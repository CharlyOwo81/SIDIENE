import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import Button from '../../assets/components/Button/Button';
import Label from '../../assets/components/Label/Label';
import SelectField from '../../assets/components/SelectField/SelectField'; // Import SelectField
import GoBackButton from '../../assets/components/Button/GoBackButton';
import styles from '../ManageStaff/QueryStaff.module.css'; // Use same styles as QueryStaff
import InputField from '../../assets/components/InputField/InputField';

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

const gradeOptions = [
  { value: '', label: 'Todos' },
  { value: "1", label: "1°" },
  { value: "2", label: "2°" },
  { value: "3", label: "3°" },
];

const groupOptions = [
  { value: '', label: 'Todos'},
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E"},
  { value: "F", label: "F" }
];


const QueryStudentForm: React.FC<StudentQueryFormProps> = ({
  searchQuery,
  filters,
  handleSearchChange,
  handleFilterChange,
  handleSubmit,
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={styles.queryContainer}
    >
      <form onSubmit={handleSubmit} className={styles.queryForm}>
        <div className={styles.inputGroup}>
        <h2 className={styles.formTitle}>Consultar Alumnado</h2>
          <Label htmlFor="search">Buscar por Nombre o CURP</Label>
          <InputField
            type="text"
            name={'search'}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Nombre, CURP, etc."
            className={styles.searchInput}/>
        </div>

        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <Label htmlFor="grado">Grado</Label>
            <motion.div 
              whileFocus={{ scale: 1.02 }} 
              transition={{ duration: 0.2 }}
            >
              <SelectField
                name="grado"
                options={gradeOptions}
                id="grado"
                value={filters.grado}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              />
            </motion.div>
          </div>

          <div className={styles.filterGroup}>
            <Label htmlFor="grupo">Grupo</Label>
            <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <SelectField
                id="grupo"
                name="grupo"
                value={filters.grupo}
                onChange={handleFilterChange}
                options={groupOptions}
                className={styles.filterSelect}
              />
            </motion.div>
          </div>
        </div>


        <div 
          className={styles.fullWidth} 
          style={{ 
            display: "flex",
            justifyContent: "center",
            gap: "1rem", // Espacio entre botones
            alignItems: "center" // Alineación vertical
          }}
        >
          <GoBackButton />
          <Button type="submit">Buscar</Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QueryStudentForm;