import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import InputField from "../../assets/components/InputField/InputField";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import styles from "./QueryStaff.module.css";
import Label from "../../assets/components/Label/Label";
import GoBackButton from "../../assets/components/Button/GoBackButton";

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
  { value: "", label: "Todos" },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={styles.queryContainer}
    >
      <form onSubmit={handleSubmit} className={styles.queryForm}>
        <div className={styles.inputGroup}>
          <h2 className={styles.formTitle}>Consultar personal</h2>
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
    </motion.div>
  );
};

export default QueryStaffForm;
