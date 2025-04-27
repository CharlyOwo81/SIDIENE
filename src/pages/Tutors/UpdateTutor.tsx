import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import TutorForm from './TutorForm';
import TutorModal from './ModalTutores';
import Navbar from '../../assets/components/Navbar/TutorNavbar';
import SelectField from '../../assets/components/SelectField/SelectField';
import Label from '../../assets/components/Label/Label';
import styles from './ManageTutors.module.css';

const UpdateTutor: React.FC = () => {
  const navigate = useNavigate();
  const [grado, setGrado] = useState<string>('');
  const [grupo, setGrupo] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [students, setStudents] = useState<{ curp: string; nombre_completo: string }[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  // Fetch students when grado and grupo are selected
  useEffect(() => {
    if (grado && grupo) {
      const fetchStudents = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3307/api/students/by-grade-group`, {
            params: { grado, grupo },
          });
          setStudents(response.data.data);
        } catch (error) {
          setAlert({ message: 'Error al cargar estudiantes', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [grado, grupo]);

  // Fetch tutors when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      const fetchTutors = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3307/api/tutor/student/${selectedStudent}`);
          setTutors(response.data.data);
          setIsModalOpen(true);
        } catch (error) {
          setAlert({ message: 'Error al cargar tutores', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchTutors();
    }
  }, [selectedStudent]);

  // Fetch tutor details and associated students when a tutor is selected
  const handleSelectTutor = async (tutor: any) => {
    try {
      setLoading(true);
      const studentsResponse = await axios.get(`http://localhost:3307/api/tutor/${tutor.curp}/students`);
      setSelectedTutor({
        ...tutor,
        estudiantes: studentsResponse.data.data.map((s: any) => s.curp),
      });
      setIsModalOpen(false);
    } catch (error) {
      setAlert({ message: 'Error al cargar datos del tutor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData: any) => {
    try {
      setIsSubmitting(true);
      await axios.put(`http://localhost:3307/api/tutor/${updatedData.curp}`, updatedData);
      setAlert({ message: 'Tutor actualizado exitosamente', type: 'success' });
      setTimeout(() => navigate('/QueryTutors'), 2000);
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Error al actualizar el tutor',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      <Navbar />
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <h2 className={styles.title}>Actualización de Tutor</h2>

      {loading && <div className={styles.loading}>Cargando...</div>}

      {!selectedTutor && !loading && (
        <div className={styles.selectionContainer}>
          <div className={styles.inputWrapper}>
            <Label htmlFor="grado">Grado</Label>
            <SelectField
              id="grado"
              name="grado"
              value={grado}
              onChange={(e) => {
                setGrado(e.target.value);
                setGrupo('');
                setSelectedStudent('');
                setStudents([]);
              }}
              options={[{ value: '', label: 'Seleccione Grado' }, ...gradoOptions]}
              disabled={loading}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Label htmlFor="grupo">Grupo</Label>
            <SelectField
              id="grupo"
              name="grupo"
              value={grupo}
              onChange={(e) => {
                setGrupo(e.target.value);
                setSelectedStudent('');
                setStudents([]);
              }}
              options={[{ value: '', label: 'Seleccione Grupo' }, ...grupoOptions]}
              disabled={!grado || loading}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Label htmlFor="student">Estudiante</Label>
            <SelectField
              id="student"
              name="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              options={[
                { value: '', label: 'Seleccione Estudiante' },
                ...students.map((s) => ({
                  value: s.curp,
                  label: s.nombre_completo,
                })),
              ]}
              disabled={!grupo || loading}
            />
          </div>
        </div>
      )}

      <TutorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tutors={tutors}
        onSelectTutor={handleSelectTutor}
      />

      {selectedTutor && (
        <TutorForm
          tutor={selectedTutor}
          onSave={handleSave}
          onCancel={() => navigate('/QueryTutors')}
        />
      )}
    </motion.div>
  );
};

export default UpdateTutor;