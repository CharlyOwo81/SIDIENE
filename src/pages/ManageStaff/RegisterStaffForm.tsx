import React from 'react';
import { motion } from 'framer-motion';
import InputField from '../../assets/components/InputField/InputField';
import Button from '../../assets/components/Button/Button';
import FormSection from '../../assets/components/FormSection/FormSection';
import GoBackButton from '../../assets/components/Button/GoBackButton';
import Label from '../../assets/components/Label/Label';
import SelectField from '../../assets/components/SelectField/SelectField';
import styles from './AddStudents.module.css';

// Definir las opciones para los select
const gradoOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
];

const grupoOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
];

interface StaffFormProps {
  formData: {
    curp: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rol: string;
  };
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Unified handler
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterStaffForm: React.FC<StaffFormProps> = ({
  formData,
  isSubmitting,
  handleInputChange,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      className={styles.container}
    >
      <h2 className={styles.formTitle}>Registrar Estudiantes</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <div className={styles.formGrid}>
            <FormSection title="Información Personal">
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
            </FormSection>

            <FormSection title="Información Escolar">
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
            </FormSection>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span> Guardando
                </>
              ) : (
                'Guardar'
              )}
            </Button>
            <GoBackButton />
          </div>
        </fieldset>
      </form>
    </motion.div>
  );
};

export default RegisterStaffForm;