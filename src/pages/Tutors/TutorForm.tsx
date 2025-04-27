import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './ManageTutors.module.css';
import InputField from '../../assets/components/InputField/InputField';
import SelectField from '../../assets/components/SelectField/SelectField';
import Button from '../../assets/components/Button/Button';
import Label from '../../assets/components/Label/Label';
import { getParentescos } from '../../services/parentescoApi';
import { getAllStudents } from '../../services/studentsApi';
import axios from 'axios';
import Modal from '../../assets/components/Modal/ModalTutors';
import GoBackButton from '../../assets/components/Button/GoBackButton';

interface TutorFormProps {
  tutor?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
}

const TutorForm: React.FC<TutorFormProps> = ({ tutor, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    curp: tutor?.curp || '',
    nombres: tutor?.nombres || '',
    apellido_paterno: tutor?.apellido_paterno || '',
    apellido_materno: tutor?.apellido_materno || '',
    telefono: tutor?.telefono || '',
    email: tutor?.email || '',
    parentesco_id: tutor?.parentesco_id?.toString() || '1',
  });

  const [parentescos, setParentescos] = useState<{ id: number; tipo: string }[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(tutor?.estudiantes || []);
  const [selectedStudentsData, setSelectedStudentsData] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchParentescos = async () => {
      try {
        const parentescoData = await getParentescos();
        setParentescos(parentescoData);
      } catch (err) {
        setError('Error al cargar opciones de parentesco');
      }
    };
    fetchParentescos();
  }, []);

  useEffect(() => {
    const fetchAssociatedStudents = async () => {
      if (tutor?.curp) {
        try {
          const response = await axios.get(`http://localhost:3307/api/tutor/${tutor.curp}/students`);
          const associatedStudents = response.data.data;
          console.log('Fetched students:', associatedStudents); // Debug log
          setSelectedStudents(associatedStudents.map((student: Student) => student.curp));
          setSelectedStudentsData(associatedStudents);
        } catch (err: any) {
          console.error('Error fetching associated students:', err.response || err);
          const message = err.response?.status === 404 
            ? 'Tutor no encontrado o sin estudiantes asociados'
            : 'Error al cargar estudiantes asociados';
          setError(message);
        }
      }
    };
    fetchAssociatedStudents();
  }, [tutor]);

  const handleSearchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      setStudentError(null);
      const response = await getAllStudents('', {
        grado: [],
        grupo: []
      });
      setStudents(response.data.data);
      setIsModalOpen(true);
    } catch (err) {
      setStudentError(err instanceof Error ? err.message : 'Error al buscar estudiantes');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudentsData((prev) => {
      const exists = prev.some((s) => s.curp === student.curp);
      return exists ? prev.filter((s) => s.curp !== student.curp) : [...prev, student];
    });
    setSelectedStudents((prev) =>
      prev.includes(student.curp)
        ? prev.filter((curp) => curp !== student.curp)
        : [...prev, student.curp]
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case 'curp':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      case 'telefono':
        processedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const curpRegex = /^[A-Z]{4}\d{6}[A-Z]{6}[\dA-Z]{2}$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!curpRegex.test(formData.curp)) {
      return setSubmitError('CURP inválido. Ejemplo válido: BABI041023MSRRYGH0');
    }

    if (!phoneRegex.test(formData.telefono)) {
      return setSubmitError('Teléfono debe tener 10 dígitos');
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      return setSubmitError('Formato de email inválido (opcional)');
    }

    if (selectedStudents.length === 0) {
      return setSubmitError('Selecciona al menos un estudiante');
    }

    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...formData,
        parentesco_id: parseInt(formData.parentesco_id, 10),
        estudiantes: selectedStudents,
      };
      await onSave(dataToSubmit);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Error al guardar tutor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.formContainer}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.formTitle}>{tutor?.curp ? 'Editar Tutor' : 'Registrar Tutor'}</h2>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formColumns}>
        {/* Columna Tutor */}
        <div className={styles.formColumn}>
          <h3 className={styles.columnTitle}>Datos del Tutor</h3>
          
          <div className={styles.formGroup}>
            <Label htmlFor="curp">CURP</Label>
            <InputField
              name="curp"
              value={formData.curp}
              onChange={handleChange}
              disabled={!!tutor?.curp}
              placeholder="Ej: BABI041023MSRRYGH0"
              maxLength={18}
              type="text"
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="nombres">Nombres</Label>
            <InputField
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Nombres completos"
              type="text"
              disabled={!!tutor?.curp} // Disable for updates
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
            <InputField
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              placeholder="Apellido paterno"
              type="text"
              disabled={!!tutor?.curp} // Disable for updates
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="apellido_materno">Apellido Materno</Label>
            <InputField
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              placeholder="Apellido materno (opcional)"
              type="text"
              disabled={!!tutor?.curp} // Disable for updates
            />
          </div>
        </div>

        {/* Columna Contacto */}
        <div className={styles.formColumn}>
          <h3 className={styles.columnTitle}>Contacto</h3>
          
          <div className={styles.formGroup}>
            <Label htmlFor="telefono">Teléfono</Label>
            <InputField
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="10 dígitos"
              type="tel"
              maxLength={10}
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="email">Email</Label>
            <InputField
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="ejemplo@dominio.com"
            />
          </div>

          <div className={styles.formGroup}>
            <Label htmlFor="parentesco_id">Parentesco</Label>
            <SelectField
              name="parentesco_id"
              value={formData.parentesco_id}
              onChange={handleChange}
              options={parentescos.map((p) => ({
                value: p.id.toString(),
                label: p.tipo,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Sección Estudiantes */}
      <div className={styles.fullWidthSection}>
        <h3 className={styles.columnTitle}>Estudiantes Asociados</h3>
        
        <div className={styles.studentControls}>
          <Button
            type="button"
            onClick={handleSearchStudents}
            disabled={isLoadingStudents}
          >
            {isLoadingStudents ? 'Buscando...' : 'Buscar Estudiantes'}
          </Button>
          
          {selectedStudentsData.length > 0 && (
            <span className={styles.studentCount}>
              {selectedStudentsData.length} estudiantes seleccionados
            </span>
          )}
        </div>

        {selectedStudentsData.length > 0 && (
          <div className={styles.selectedStudents}>
            <ul className={styles.studentList}>
              {selectedStudentsData.map((student) => (
                <li key={student.curp} className={styles.studentItem}>
                  <div className={styles.studentInfoContainer}>
                    <span className={styles.studentName}>
                      {student.nombres || 'Sin nombre'} {student.apellidoPaterno || 'Sin apellido paterno'}
                      {student.apellidoMaterno && ` ${student.apellidoMaterno}`}
                    </span>
                    <span className={styles.studentDetails}>
                      {(student.grado && student.grupo) ? `${student.grado}°-${student.grupo}` : 'Sin grado/grupo'} | CURP: {student.curp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStudentSelect(student)}
                    className={styles.removeButton}
                    aria-label="Remover estudiante"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {submitError && <div className={styles.error}>❌ {submitError}</div>}

      <Modal
        students={students}
        onClose={() => setIsModalOpen(false)}
        onSelectStudent={handleStudentSelect}
        isOpen={isModalOpen}
        selectedStudents={selectedStudents}
      />

      <div className={styles.formActions}>
        <GoBackButton />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span> Actualizando...
            </>
          ) : tutor?.curp ? (
            'Actualizar Tutor'
          ) : (
            'Registrar Tutor'
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default TutorForm;