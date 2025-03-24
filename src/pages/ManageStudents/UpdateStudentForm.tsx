import React, { ChangeEvent, FormEvent } from "react";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import FormSection from "../../assets/components/FormSection/FormSection";
import styles from "./ManageStudents.module.css";

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  estatus: string; 
}

interface UpdateStudentFormProps {
  formData: Student;
  isSubmitting: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

const UpdateStudentForm: React.FC<UpdateStudentFormProps> = ({
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Actualizar Datos</legend>

        <FormSection title="Información Personal">
          <InputField
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={formData.nombres}
            onChange={onInputChange}
            disabled
          />
          <InputField
            type="text"
            name="apellidoPaterno"
            placeholder="Apellido Paterno"
            value={formData.apellidoPaterno}
            onChange={onInputChange}
            disabled
          />
          <InputField
            type="text"
            name="apellidoMaterno"
            placeholder="Apellido Materno"
            value={formData.apellidoMaterno}
            onChange={onInputChange}
            disabled
          />
        </FormSection>

        <FormSection title="Información Escolar">
          <InputField
            type="text"
            name="grado"
            placeholder="Grado"
            value={formData.grado}
            onChange={onInputChange}
          />
          <InputField
            type="text"
            name="grupo"
            placeholder="Grupo"
            value={formData.grupo}
            onChange={onInputChange}
          />
          <div className={styles.inputWrapper}>
            <label htmlFor="estatus" className={styles.label}>Estatus</label>
            <select
                id="estatus"
                name="estatus" // Change from "status" to "estatus"
                value={formData.estatus}
                onChange={onInputChange}
                className={styles.selectField}
                >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="BAJA ADMINISTRATIVA">BAJA ADMINISTRATIVA</option>
            </select>
          </div>
        </FormSection>

        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span> Actualizando...
              </>
            ) : (
              "Actualizar"
            )}
          </Button>
          <Button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default UpdateStudentForm;