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
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Buscar Estudiante</legend>
        <FormSection title="CURP del Estudiante">
          <InputField
            type="text"
            name="curp"
            placeholder="Ingrese el CURP"
            value={searchCurp}
            onChange={onSearchChange}
          />
        </FormSection>
        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner}></span> Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </Button>
          <GoBackButton />
        </div>
      </fieldset>
    </form>
  );
};

export default SearchStudentForm;