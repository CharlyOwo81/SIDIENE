// components/StudentQueryForm/StudentQueryForm.tsx
import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import Label from "../../assets/components/Label/Label";
import styles from "./QueryStudents.module.css";

interface StudentQueryFormProps {
  searchQuery: string;
  filters: {
    grado: string;
    grupo: string;
    anio_ingreso: string;
  };
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const StudentQueryForm: React.FC<StudentQueryFormProps> = ({
  searchQuery,
  filters,
  handleSearchChange,
  handleFilterChange,
  handleSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      className={styles.container}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Buscar Estudiantes</legend>

          <div className={styles.inputWrapper}>
            <Label htmlFor="searchQuery">Buscar</Label>
            <InputField
              type="text"
              name="searchQuery"
              placeholder="Buscar estudiantes"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="grado">Grado</Label>
            <InputField
              type="text"
              name="grado"
              placeholder="Grado"
              value={filters.grado}
              onChange={(e) => handleFilterChange(e)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="grupo">Grupo</Label>
            <InputField
              type="text"
              name="grupo"
              placeholder="Grupo"
              value={filters.grupo}
              onChange={(e) => handleFilterChange(e)}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="anio_ingreso">Año de Ingreso</Label>
            <InputField
              type="text"
              name="anio_ingreso"
              placeholder="Año de Ingreso"
              value={filters.anio_ingreso}
              onChange={(e) => handleFilterChange(e)}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit">Buscar</Button>
            <GoBackButton />
          </div>
        </fieldset>
      </form>
    </motion.div>
  );
};

export default StudentQueryForm;