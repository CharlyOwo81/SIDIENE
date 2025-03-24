// src/components/StaffForm.tsx
import React, { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import Label from "../../assets/components/Label/Label"; // Import reusable Label
import GoBackButton from "../../assets/components/Button/GoBackButton";
import styles from "./AddStaff.module.css";

interface StaffFormProps {
  formData: {
    curp: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    rol: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  formData,
  isSubmitting,
  onInputChange,
  onSelectChange,
  onSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      className={styles.formContainer}
    >
      <h2 className={styles.formTitle}>Registrar personal</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos Personales</legend>

          <div className={styles.inputWrapper}>
            <Label htmlFor="curp">CURP *</Label>
            <InputField
              type="text"
              name="curp"
              placeholder="Ingresa el CURP"
              value={formData.curp}
              onChange={onInputChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="nombre">Nombre *</Label>
            <InputField
              type="text"
              name="nombre"
              placeholder="Ingresa el nombre"
              value={formData.nombre}
              onChange={onInputChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
            <InputField
              type="text"
              name="apellidoPaterno"
              placeholder="Ingresa el apellido paterno"
              value={formData.apellidoPaterno}
              onChange={onInputChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
            <InputField
              type="text"
              name="apellidoMaterno"
              placeholder="Ingresa el apellido materno"
              value={formData.apellidoMaterno}
              onChange={onInputChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <Label htmlFor="telefono">Teléfono *</Label>
            <InputField
              type="text"
              name="telefono"
              placeholder="Ingresa el teléfono"
              value={formData.telefono}
              onChange={onInputChange}
            />
          </div>

          <legend className={styles.legend}>Información Laboral</legend>
          <div className={styles.inputWrapper}>
            <Label htmlFor="rol">Rol *</Label>
            <motion.select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={onSelectChange}
              whileFocus={{ scale: 1.02, borderColor: "#F3C44D" }}
              transition={{ duration: 0.2 }}
              className={styles.select}
            >
              <option value="">Seleccione un rol</option>
              <option value="DIRECTIVO">Directivo</option>
              <option value="PREFECTO">Prefecto</option>
              <option value="DOCENTE">Docente</option>
              <option value="TRABAJADOR SOCIAL">Trabajador Social</option>
            </motion.select>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <GoBackButton/>
          </div>
        </fieldset>
      </form>
    </motion.div>
  );
};

export default StaffForm;