// components/SearchAndFilters/SearchAndFilters.tsx
import React, { ChangeEvent } from "react";
import InputField from "../../components/InputField/InputField";
import FormSection from "../../components/FormSection/FormSection";
import styles from "../../../pages/ManageStudents/ManageStudents.module.css";


interface SearchAndFiltersProps {
  searchQuery: string;
  filters: {
    grado: string;
    grupo: string;
    anio_ingreso: string;
  };
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
}) => {
  return (
    <form className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Búsqueda y Filtros</legend>

        <FormSection title="Búsqueda General">
          <InputField
            type="text"
            name="search"
            placeholder="Buscar por nombre, CURP, grado, etc."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </FormSection>

        <FormSection title="Filtros Específicos">
          <InputField
            type="text"
            name="grado"
            placeholder="Grado"
            value={filters.grado}
            onChange={onFilterChange}
          />
          <InputField
            type="text"
            name="grupo"
            placeholder="Grupo"
            value={filters.grupo}
            onChange={onFilterChange}
          />
          <InputField
            type="text"
            name="anio_ingreso"
            placeholder="Año de Ingreso"
            value={filters.anio_ingreso}
            onChange={onFilterChange}
          />
        </FormSection>
      </fieldset>
    </form>
  );
};

export default SearchAndFilters;