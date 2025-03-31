import React, { ChangeEvent, FormEvent } from "react";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import FormSection from "../../assets/components/FormSection/FormSection";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import styles from "./AddStaff.module.css";

interface SearchStaffFormProps {
  searchCurp: string;
  isLoading: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

const SearchStaffForm: React.FC<SearchStaffFormProps> = ({
  searchCurp,
  isLoading,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className={styles.form}>
        <FormSection title="CURP del integrante del personal">
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

export default SearchStaffForm;