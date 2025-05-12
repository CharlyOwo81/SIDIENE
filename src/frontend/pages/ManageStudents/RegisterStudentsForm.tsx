// src/components/RegisterStudentsForm.tsx
import React from "react";
import InputField from "../../assets/components/InputField/InputField";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import styles from "./ManageStudents.module.css";
import estilo from "./DatePicker.module.css";
import DatePicker from "react-datepicker";
import "cally";
import "react-datepicker/dist/react-datepicker.css";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import { CalendarDate } from "cally";

interface FormData {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
}

interface StudentFormProps {
  formData: FormData;
  file: File | null;
  isSubmitting: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  file,
  isSubmitting,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  setFormData,
}) => {
  const gradeOptions = [
    { value: "1", label: "1°" },
    { value: "2", label: "2°" },
    { value: "3", label: "3°" },
  ];

  const groupOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
  ];

  const handleYearChange = (date: Date | null) => {
    setFormData({
      ...formData,
      anio_ingreso: date?.getFullYear().toString() || "",
    });
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registrar Estudiantes</h2>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Columna de Información Personal */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Información Personal</h3>
          <div>
            <label className={styles.label}>CURP</label>
            <InputField
              type="text"
              name="curp"
              placeholder="Ingrese CURP"
              value={formData.curp}
              onChange={handleInputChange}
              disabled={isSubmitting}
              maxLength={18}
            />
          </div>
          <div>
            <label className={styles.label}>Nombres</label>
            <InputField
              type="text"
              name="nombres"
              placeholder="Ingrese nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={styles.label}>Apellido Paterno</label>
            <InputField
              type="text"
              name="apellidoPaterno"
              placeholder="Ingrese apellido paterno"
              value={formData.apellidoPaterno}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={styles.label}>Apellido Materno</label>
            <InputField
              type="text"
              name="apellidoMaterno"
              placeholder="Ingrese apellido materno"
              value={formData.apellidoMaterno}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Columna de Información Escolar */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Información Escolar</h3>
          <div>
            <label className={styles.label}>Grado</label>
            <SelectField
              name="grado"
              options={gradeOptions}
              value={formData.grado}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={styles.label}>Grupo</label>
            <SelectField
              name="grupo"
              options={groupOptions}
              value={formData.grupo}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className={styles.label}>Año de Ingreso</label>
            <div className={estilo.datePickerWrapper}>
              <DatePicker
                selected={
                  formData.anio_ingreso ? new Date(formData.anio_ingreso) : null
                }
                onChange={handleYearChange}
                dateFormat="yyyy"
                showYearPicker
                className={estilo.datePickerInput}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Elementos de ancho completo */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>Subir PDF (opcional)</label>
          <InputField
            type="file"
            name="file"
            placeholder="Seleccione un archivo PDF"
            value={file ? file.name : ""}
            onChange={handleFileChange}
            disabled={isSubmitting}
            className={styles.fileInput}
          />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
