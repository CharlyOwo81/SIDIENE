import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../assets/components/InputField/InputField';
import Button from '../../assets/components/Button/Button';
import FormSection from '../../assets/components/FormSection/FormSection';
import GoBackButton from '../../assets/components/Button/GoBackButton';
import Label from '../../assets/components/Label/Label';
import SelectField from '../../assets/components/SelectField/SelectField';
import styles from './AddStaff.module.css';

// Definir las opciones para los select
const gradoOptions = [
  { value: 'DIRECTIVO', label: 'DIRECTIVO' },
  { value: 'DOCENTE', label: 'DOCENTE' },
  { value: 'PREFECTO', label: 'PREFECTO' },
  { value: 'TRABAJADOR SOCIAL', label: 'TRABAJADOR SOCIAL' },
];

interface StaffFormProps {
  formData: {
    curp: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rol: string;
    telefono: string;
  };
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Unified handler
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterStaffForm: React.FC<StaffFormProps> = ({
  formData,
  isSubmitting,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}) => {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registrar Personal</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Información Personal</h3>
              <div className={styles.inputWrapper}>
                <Label htmlFor="curp">CURP</Label>
                <InputField
                  type="text"
                  name="curp"
                  placeholder="CURP"
                  value={formData.curp}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              </div>

            <div className={styles.column}>
            <h3 className={styles.columnTitle}>Información Laboral</h3>
              <div className={styles.inputWrapper}>
                <Label htmlFor="telefono">Teléfono</Label>
                <InputField
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  disabled={isSubmitting}/>
              </div>
              <div className={styles.inputWrapper}>
                <Label htmlFor="rol">Rol</Label>
                <SelectField
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange} // Use handleInputChange
                  options={gradoOptions}
                  disabled={isSubmitting}
                />
              </div>
              </div>
          </div>

        <div 
          className={styles.fullWidth} 
          style={{ 
            display: "flex",
            justifyContent: "center",
            gap: "1rem", // Espacio entre botones
            alignItems: "center" // Alineación vertical
          }}>
          <GoBackButton/>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStaffForm;