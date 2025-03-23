// components/StudentForm/StudentForm.tsx
import React from "react";
import { motion } from "framer-motion";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import FormSection from "../../assets/components/FormSection/FormSection";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import Label from "../../assets/components/Label/Label"; // Import the new Label component
import styles from "./ManageStudents.module.css";

interface StudentFormProps {
  formData: {
    curp: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    grado: string;
    grupo: string;
    anio_ingreso: string;
  };
  file: File | null;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  file,
  isSubmitting,
  handleInputChange,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      className={styles.container}
    >
      <h2 className={styles.formTitle}>Registrar Estudiantes</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Información del Estudiante</legend>

          <FormSection title="Información Personal">
            <div className={styles.inputWrapper}>
              <Label htmlFor="curp">CURP</Label>
              <InputField
                type="text"
                name="curp"
                placeholder="CURP"
                value={formData.curp}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="nombres">Nombres</Label>
              <InputField
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
              <InputField
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
              <InputField
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <FormSection title="Información Escolar">
            <div className={styles.inputWrapper}>
              <Label htmlFor="grado">Grado</Label>
              <InputField
                type="text"
                name="grado"
                placeholder="Grado"
                value={formData.grado}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="grupo">Grupo</Label>
              <InputField
                type="text"
                name="grupo"
                placeholder="Grupo"
                value={formData.grupo}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="anio_ingreso">Año de Ingreso</Label>
              <InputField
                type="text"
                name="anio_ingreso"
                placeholder="Año de Ingreso"
                value={formData.anio_ingreso}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <div className={styles.fileUpload}>
            <div className={styles.inputWrapper}>
              <Label htmlFor="file-upload">Subir PDF con Datos</Label>
              <input
                type="file"
                id="file-upload"
                name="file"
                title="Subir PDF con Datos"
                onChange={handleFileChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span> Guardando
                </>
              ) : (
                "Guardar"
              )}
            </Button>
            <GoBackButton />
          </div>
        </fieldset>
      </form>
    </motion.div>
  );
};

export default StudentForm;