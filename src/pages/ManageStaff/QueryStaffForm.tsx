import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import Button from '../../assets/components/Button/Button';
import Label from '../../assets/components/Label/Label';
import SelectField from '../../assets/components/SelectField/SelectField'; // Import SelectField
import GoBackButton from '../../assets/components/Button/GoBackButton';
import styles from '../ManageStaff/AddStaff.module.css'; // Use same styles as QueryStaff
import InputField from '../../assets/components/InputField/InputField';

interface QueryStaffFormProps {
    searchQuery: string;
    filters: {
      rol: string[];
    };
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }
  const rolOptions = [
    { value: '', label: "Todos" },
    { value: "DOCENTE", label: "Docente" },
    { value: "PREFECTO", label: "Prefecto" },
    { value: "DIRECTIVO", label: "Directivo" },
    { value: "TRABAJADOR SOCIAL", label: "Trabajador Social" },
  ];
  
  const QueryStaffForm: React.FC<QueryStaffFormProps> = ({
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    handleSubmit,
  }) => {
    return (
      <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registrar Personal</h2>
        <form onSubmit={handleSubmit} className={styles.queryForm}>
          <div className={styles.inputGroup}>
            <h2 className={styles.formTitle}>Consultar Personal</h2>
            <Label htmlFor="search">Buscar por Nombre o CURP</Label>
            <InputField
              type="text"
              name={"search"}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Nombre, CURP, etc."
              className={styles.searchInput}
            />
          </div>
  
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <Label htmlFor="rol">Rol</Label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <SelectField
                  name="rol"
                  options={rolOptions}
                  id="rol"
                  value={filters.rol}
                  onChange={handleFilterChange}
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
              alignItems: "center", // Alineación vertical
            }}
          >
            <GoBackButton />
            <Button type="submit">Buscar</Button>
          </div>
        </form>
      </div>
    );
  };
  
  export default QueryStaffForm;
  