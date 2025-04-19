// TutorForm.tsx
import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './ManageTutors.module.css';
import InputField from '../../assets/components/InputField/InputField';
import SelectField from '../../assets/components/SelectField/SelectField';
import Button from '../../assets/components/Button/Button';

interface TutorFormProps {
  tutor?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TutorForm: React.FC<TutorFormProps> = ({ tutor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    curp: tutor?.curp || '',
    nombres: tutor?.nombres || '',
    apellido_paterno: tutor?.apellido_paterno || '',
    apellido_materno: tutor?.apellido_materno || '',
    telefono: tutor?.telefono || '',
    email: tutor?.email || '',
    parentesco_id: tutor?.parentesco_id || '1'
  });

  const parentescos = [
    { id: 1, tipo: 'Padre' },
    { id: 2, tipo: 'Madre' },
    { id: 3, tipo: 'Tutor Legal' },
    { id: 4, tipo: 'Otro' }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <div className={styles.formGrid}>
        <InputField
          name="curp"
          value={formData.curp}
          onChange={handleChange}
          disabled={!!tutor?.curp}
          placeholder='CURP del Tutor'
          type='text'
        />

        <InputField
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          placeholder='Nombre(s)'
          type='text'
        />

        <InputField
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
            placeholder='Apellido Paterno'
            type='text'
        />

        <InputField
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
            placeholder='Apellido Materno'
            type='text'
        />

        <InputField
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          type="tel"
            placeholder='Teléfono'
        />

        <InputField
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
            placeholder='Email'
        />

        <SelectField
          name="parentesco_id"
          value={formData.parentesco_id}
          onChange={handleChange}
          options={parentescos.map(p => ({
            value: p.id.toString(),
            label: p.tipo
          }))}
        />
      </div>

      <div className={styles.formButtons}>
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {tutor?.curp ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </motion.form>
  );
};

export default TutorForm;