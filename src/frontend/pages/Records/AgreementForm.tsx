import { useState } from 'react';
import styles from './ManageExpedientes.module.css';
import SelectField from '../../assets/components/SelectField/SelectField';

const estatusOptions = [
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'EN PROCESO', label: 'En Proceso' },
  { value: 'COMPLETADO', label: 'Completado' },
];

type Agreement = {
  id_acuerdo?: string;
  descripcion: string;
  estatus: string;
  fecha_creacion: string;
  id_incidencia: string;
};

type Props = {
  initialData?: Agreement;
  onSubmit: (data: Agreement) => void;
};

const AgreementForm = ({ initialData, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    descripcion: initialData?.descripcion || '',
    estatus: initialData?.estatus && estatusOptions.some(opt => opt.value === initialData.estatus) 
      ? initialData.estatus 
      : 'ABIERTO',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que estatus sea uno de los valores permitidos
    const validEstatus = estatusOptions.some(opt => opt.value === formData.estatus)
      ? formData.estatus
      : 'ABIERTO';
    
    onSubmit({
      ...formData,
      estatus: validEstatus,
      id_acuerdo: initialData?.id_acuerdo || '',
      fecha_creacion: new Date().toISOString(),
      id_incidencia: initialData?.id_incidencia || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formField}>
        <label className={styles.formLabel}>Descripción del Acuerdo</label>
        <textarea
          className={`${styles.formInput} min-h-[100px]`}
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          placeholder="Descripción del acuerdo"
          required
        />
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel}>Estatus</label>
        <SelectField
          className={styles.formSelect}
          value={formData.estatus}
          onChange={(e) => setFormData({ ...formData, estatus: e.target.value })}
          required
          options={estatusOptions}
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Guardar Acuerdo
        </button>
      </div>
    </form>
  );
};

export default AgreementForm;