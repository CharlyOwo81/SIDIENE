import React, { ChangeEvent, FormEvent } from "react";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import FormSection from "../../assets/components/FormSection/FormSection";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import styles from "./ManageStudents.module.css";

interface SearchStudentFormProps {
  searchCurp: string;
  isLoading: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

const SearchStudentForm: React.FC<SearchStudentFormProps> = ({
  searchCurp,
  isLoading,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className={styles.form}>
        <FormSection title="CURP del Estudiante">
          <InputField
            type="text"
            name="curp"
            placeholder="Ingrese el CURP"
            value={searchCurp}
            onChange={onSearchChange}
          />
        </FormSection>
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
  );
};

export default SearchStudentForm;