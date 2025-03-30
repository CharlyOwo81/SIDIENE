import React, { ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import InputField from '../../assets/components/InputField/InputField';
import SelectField from '../../assets/components/SelectField/SelectField';
import Button from '../../assets/components/Button/Button';
import FormSection from '../../assets/components/FormSection/FormSection';
import GoBackButton from '../../assets/components/Button/GoBackButton';
import Label from '../../assets/components/Label/Label';
import styles from './AddStaff.module.css';

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
}

interface UpdateStaffFormProps {
  formData: Staff;
  isSubmitting: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

const UpdateStaffForm: React.FC<UpdateStaffFormProps> = ({
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
}) => {
  const rolOptions = [
    { value: 'DOCENTE', label: 'DOCENTE' },
    { value: 'DIRECTIVO', label: 'DIRECTIVO' },
    { value: 'TRABAJADOR SOCIAL', label: 'TRABAJADOR SOCIAL' },
    { value: 'PREFECTO', label: 'PREFECTO' },
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
        <FormSection title="Información Laboral">
          
          <div className={styles.inputWrapper}>
            <Label htmlFor="rol">Grupo</Label>
            <SelectField
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={onInputChange}
              options={rolOptions}
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

export default UpdateStaffForm;