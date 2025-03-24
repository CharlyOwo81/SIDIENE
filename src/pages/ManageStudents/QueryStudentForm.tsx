// src/components/StudentQueryForm/StudentQueryForm.tsx
import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import Button from "../../assets/components/Button/Button"; // Your reusable Button component
import Label from "../../assets/components/Label/Label"; // Reusable Label component
import styles from "./QueryStudents.module.css";
import GoBackButton from "../../assets/components/Button/GoBackButton";


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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
            whileFocus={{ scale: 1.02, borderColor: "#F3C44D" }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <Label htmlFor="grado">Grado</Label>
            <motion.select
              id="grado"
              name="grado"
              multiple
              value={filters.grado}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              whileFocus={{ scale: 1.02, borderColor: "#F3C44D" }}
              transition={{ duration: 0.2 }}
            >
              <option value="">Todos</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </motion.select>
          </div>

          <div className={styles.filterGroup}>
            <Label htmlFor="grupo">Grupo</Label>
            <motion.select
              id="grupo"
              name="grupo"
              multiple
              value={filters.grupo}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              whileFocus={{ scale: 1.02, borderColor: "#F3C44D" }}
              transition={{ duration: 0.2 }}
            >
              <option value="">Todos</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </motion.select>
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