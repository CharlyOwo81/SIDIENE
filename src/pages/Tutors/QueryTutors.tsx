import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageTutors.module.css';
import TutorList from './TutorList';
import Modal from '../../assets/components/Modal/ModalTutors'; // Assuming this is the correct modal
import SelectField from '../../assets/components/SelectField/SelectField';
import InputField from '../../assets/components/InputField/InputField';
import Button from '../../assets/components/Button/Button';
import Navbar from '../../assets/components/Navbar/TutorNavbar';
import GoBackButton from '../../assets/components/Button/GoBackButton';

const QueryTutors: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    grado: '',
    grupo: ''
  });

  const gradeOptions = [
    { value: '', label: 'Todos' },
    { value: "1", label: "1°" },
    { value: "2", label: "2°" },
    { value: "3", label: "3°" },
  ];

  const groupOptions = [
    { value: '', label: 'Todos' },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedStudent) {
          // Use the dedicated endpoint for curpEstudiante
          const response = await axios.get(`http://localhost:3307/api/tutor/student/${selectedStudent.curp}`);
          setTutors(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setAlert({ message: 'Error cargando tutores', type: 'error' });
      }
    };

    // Only fetch if a student is selected
    if (selectedStudent) {
      fetchData();
    }
  }, [selectedStudent]); // Only depend on selectedStudent

// Fetch students for the modal
const fetchStudents = async () => {
  try {
    const params: any = {};
    if (filters.grado) params.grado = filters.grado;
    if (filters.grupo) params.grupo = filters.grupo;

    const response = await axios.get('http://localhost:3307/api/students', { params });
    setStudents(response.data.data);
    setShowStudentModal(true);
  } catch (error) {
    console.error('Error fetching students:', error);
    setAlert({ message: 'Error cargando estudiantes', type: 'error' });
  }
};

const handleSelectStudent = (student: any) => {
  setSelectedStudent(student);
  setFilters({
    grado: student.grado,
    grupo: student.grupo
  });
  setShowStudentModal(false);
};
const handleClearSelection = () => {
  setSelectedStudent(null);
  setFilters({ grado: '', grupo: '' });
  setTutors([]); // Clear tutors when clearing selection
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <Navbar/>
      
      <div className={styles.header}>
        <h2 className={styles.formTitle}>Consulta de Tutores</h2>
        
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Grado</label>
            <SelectField
              options={gradeOptions}
              value={filters.grado}
              onChange={(e) => setFilters({ ...filters, grado: e.target.value })}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Grupo</label>
            <SelectField
              options={groupOptions}
              value={filters.grupo}
              onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
            />
          </div>
          <Button
            onClick={fetchStudents}
            disabled={!filters.grado || !filters.grupo} type={'button'}>
            Seleccionar Estudiante
          </Button>
        </div>
      </div>

      {selectedStudent && (
        <div className={styles.selectedStudent}>
          <div className={styles.studentInfoWrapper}>
            <label className={styles.label}>Estudiante Seleccionado</label>
            <InputField
            name="nombreCompleto"
              placeholder='Nombre del Estudiante'
              onChange={()=>{}}
              type="text"
              value={`${selectedStudent.nombres} ${selectedStudent.apellidoPaterno} ${selectedStudent.apellidoMaterno || ''}`}
              disabled={true}
              className={styles.disabledInput}
            />
          </div>
          <Button
            onClick={handleClearSelection} type={'button'}>
            Limpiar Selección
          </Button>
        </div>
      )}

      {tutors.length > 0 && (
        <TutorList 
          tutors={tutors}
          onEdit={() => {}}
          onDelete={async (curp: string) => {
            try {
              await axios.delete(`http://localhost:3307/api/tutors/${curp}`);
              setTutors(tutors.filter(t => t.curp !== curp));
              setAlert({ message: 'Tutor eliminado exitosamente', type: 'success' });
            } catch (error) {
              console.error('Error deleting tutor:', error);
              setAlert({ message: 'Error eliminando tutor', type: 'error' });
            }
          }}
        />
      )}

      <Modal
        students={students}
        onClose={() => setShowStudentModal(false)}
        onSelectStudent={handleSelectStudent}
        isOpen={showStudentModal}
        selectedStudents={selectedStudent ? [selectedStudent.curp] : []}
      />
      <GoBackButton/>
    </motion.div>
  );
};

export default QueryTutors;