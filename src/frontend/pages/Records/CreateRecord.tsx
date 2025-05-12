// src/pages/CreateRecord.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import SelectField from '../../assets/components/SelectField/SelectField';
import Alert from '../../assets/components/Alert/Alert';
import Navbar from '../../assets/components/Navbar/Navbar';
import styles from './ManageExpedientes.module.css';
import {gradoOptions, grupoOptions} from '../../../backend/constants/filtersOptions';

const CreateRecord = () => {
  const [formData, setFormData] = useState({ id_estudiante: '' });
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const navigate = useNavigate();

  // Fetch students by grade and group
  useEffect(() => {
    if (grade && group) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3307/api/students?grado=${grade}&grupo=${group}`);
          setStudents(response.data.data || []);
          setAlert(null);
        } catch (error) {
          console.error('Error fetching students:', error);
          setAlert({
            message: (error as any).response?.data?.message || 'Error al cargar estudiantes',
            type: 'error'
          });
          setStudents([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [grade, group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    
    try {
      await axios.post('http://localhost:3307/api/expedientes', {
        id_estudiante: formData.id_estudiante,
      });
      
      setAlert({
        message: '¡Expediente creado exitosamente!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/ViewRecord', { state: { idEstudiante: formData.id_estudiante } });
      }, 1500);
    } catch (error) {
      console.error('Error creating expediente:', error);
      setAlert({
        message: (error as any).response?.data?.message || 'Error al crear expediente',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const studentOptions = [
    { 
      value: '', 
      label: students.length === 0 ? 'No hay estudiantes disponibles' : 'Seleccionar estudiante' 
    },
    ...students.map((student: any) => ({
      value: student.curp,
      label: `${student.nombres || ''} ${student.apellidoPaterno || ''} ${student.apellidoMaterno || ''}`.trim() || 'Nombre no disponible',
    })),
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.mainContainer}
    >
      <Navbar 
        title="Gestionar Expedientes"
        buttons={[
          { label: "Registrar", icon: "➕", path: "/RegisterRecord" },
          { label: "Consultar", icon: "🔍", path: "/ViewRecord" },
          { label: "Actualizar", icon: "✏️", path: "/UpdateRecord" },
        ]}
        className="tutor-navbar"
      />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer}
        >
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}

      <motion.div
        className={styles.formContainer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={styles.formTitle}>Crear Nuevo Expediente</h1>
        
        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner}></span> Cargando...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.filterSection}>
            <SelectField
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setFormData({ id_estudiante: '' });
              }}
              options={gradoOptions}
              required
            />
            <SelectField
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                setFormData({ id_estudiante: '' });
              }}
              options={grupoOptions}
              required
            />
            <SelectField
              value={formData.id_estudiante}
              onChange={(e) => setFormData({ id_estudiante: e.target.value })}
              options={studentOptions}
              disabled={!grade || !group || !students.length}
              required
            />
          </div>

          <motion.div
            className={styles.formActions}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!formData.id_estudiante || loading}
            >
              {loading ? 'Creando...' : 'Crear Expediente'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default CreateRecord;