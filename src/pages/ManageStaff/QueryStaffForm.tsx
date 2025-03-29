import React, { ChangeEvent } from "react";
import InputField from "../../assets/components/InputField/InputField";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import styles from "./ManageStaff.module.css";

interface QueryStaffFormProps {
  searchQuery: string;
  filters: {
    puesto: string[];
    departamento: string[];
    estatus: string[];
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
  const puestoOptions = [
    { value: "DOCENTE", label: "Docente" },
    { value: "PREFECTO", label: "Administrativo" },
    { value: "DIRECTIVO", label: "Directivo" },
    { value: "TRABAJADOR SOCIAL", label: "Trabajador Social" },
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchContainer}>
        <InputField
                  type="text"
                  placeholder="Buscar personal..."
                  value={searchQuery}
                  onChange={handleSearchChange} name={""}        />
        <Button type="submit">Buscar</Button>
      </div>

      <div className={styles.filterContainer}>
        <SelectField
          name="puesto"
          options={puestoOptions}
          multiple
          value={filters.puesto}
          onChange={handleFilterChange}
        />
      </div>
    </form>
  );
};

export default QueryStaffForm;