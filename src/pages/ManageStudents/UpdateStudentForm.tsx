import React, { ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../assets/components/InputField/InputField';
import SelectField from '../../assets/components/SelectField/SelectField';
import Button from '../../assets/components/Button/Button';
import FormSection from '../../assets/components/FormSection/FormSection';
import GoBackButton from '../../assets/components/Button/GoBackButton';
import Label from '../../assets/components/Label/Label';
import styles from './ManageStudents.module.css';

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
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
}) => {
  const estatusOptions = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'BAJA ADMINISTRATIVA', label: 'BAJA ADMINISTRATIVA' },
    { value: 'EGRESADO', label: 'EGRESADO' },
  ];

  const grupoOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
  ];

  const gradoOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
  ];

  return (
    <motion.form
      onSubmit={onSubmit}
      className={styles.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Actualizar Datos del Estudiante</legend>

        {/* Sección de información básica no editable */}
<FormSection title="Información Básica">
  <div className={styles.inputWrapper}>
    <Label htmlFor="nombres">Nombres</Label>
    <InputField
      type="text"
      name="nombres"
      value={formData.nombres || ''}
      onChange={onInputChange}
      disabled 
      placeholder=""
    />
  </div>
  
  <div className={styles.inputWrapper}>
    <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
    <InputField
      type="text"
      name="apellidoPaterno"
      value={formData.apellidoPaterno || ''}
      onChange={onInputChange}
      disabled 
      placeholder=""
    />
  </div>
  
  <div className={styles.inputWrapper}>
    <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
    <InputField
      type="text"
      name="apellidoMaterno"
      value={formData.apellidoMaterno || ''}
      onChange={onInputChange}
      disabled 
      placeholder=""
    />
  </div>
</FormSection>

        {/* Sección de información escolar editable */}
        <FormSection title="Información Escolar">
          <div className={styles.inputWrapper}>
            <Label htmlFor="grado">Grado</Label>
            <SelectField
              id="grado"
              name="grado"
              value={formData.grado}
              onChange={onInputChange}
              options={gradoOptions}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.inputWrapper}>
            <Label htmlFor="grupo">Grupo</Label>
            <SelectField
              id="grupo"
              name="grupo"
              value={formData.grupo}
              onChange={onInputChange}
              options={grupoOptions}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.inputWrapper}>
            <Label htmlFor="estatus">Estatus</Label>
            <SelectField
              id="estatus"
              name="estatus"
              value={formData.estatus}
              onChange={onInputChange}
              options={estatusOptions}
              disabled={isSubmitting}
            />
          </div>
        </FormSection>

        {/* Botones de acción */}
        <div className={styles.buttonContainer}>
          <GoBackButton/>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span> Actualizando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </fieldset>
    </motion.form>
  );
};

export default UpdateStudentForm;