// ManageTutors.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './ManageTutors.module.css';
import Alert from '../../assets/components/Alert/Alert';
import StudentSearchModal from './StudentSearchModal';
import TutorForm from './TutorForm';
import TutorList from './TutorList';

interface Tutor {
  curp: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email: string;
  parentesco: string;
}

const ManageTutors: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    curp: string;
    nombre: string;
    grado: string;
    grupo: string;
  } | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editTutor, setEditTutor] = useState<Tutor | null>(null);

  const loadTutors = async (curp: string) => {
    try {
      const response = await axios.get(`http://localhost:3307/api/tutors/student/${curp}`);
      setTutors(response.data.data);
    } catch (error) {
      setAlert({ message: 'Error cargando tutores', type: 'error' });
    }
  };

  const handleStudentSelect = (student: any) => {
    setSelectedStudent({
      curp: student.curp,
      nombre: `${student.nombres} ${student.apellido_paterno}`,
      grado: student.grado,
      grupo: student.grupo
    });
    setShowStudentModal(false);
    loadTutors(student.curp);
  };

  const handleExportPDF = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await axios.get(
        `http://localhost:3307/api/tutors/export/${selectedStudent.curp}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tutores_${selectedStudent.curp}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      setAlert({ message: 'Error generando PDF', type: 'error' });
    }
  };

  const handleSaveTutor = async (tutorData: any) => {
    try {
      const url = editTutor 
        ? `http://localhost:3307/api/tutors/${editTutor.curp}`
        : 'http://localhost:3307/api/tutors';

      const method = editTutor ? 'put' : 'post';
      
      const response = await axios[method](url, {
        ...tutorData,
        estudiantes: selectedStudent ? [selectedStudent.curp] : []
      });

      setAlert({ message: response.data.message, type: 'success' });
      if (selectedStudent) loadTutors(selectedStudent.curp);
      setEditTutor(null);

    } catch (error) {
      setAlert({ message: 'Error guardando tutor', type: 'error' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.header}>
        <h2>Administración de Tutores</h2>
        
        <div className={styles.studentSelector}>
          {selectedStudent ? (
            <div className={styles.selectedStudent}>
              <span>{selectedStudent.nombre} ({selectedStudent.grado}° {selectedStudent.grupo})</span>
              <button onClick={() => setSelectedStudent(null)}>Cambiar estudiante</button>
            </div>
          ) : (
            <button
              className={styles.selectStudentButton}
              onClick={() => setShowStudentModal(true)}
            >
              Seleccionar Estudiante
            </button>
          )}
        </div>
      </div>

      {selectedStudent && (
        <div className={styles.actions}>
          <button onClick={handleExportPDF} className={styles.pdfButton}>
            Exportar a PDF
          </button>
          <button 
            onClick={() => setEditTutor({
              curp: '',
              nombres: '',
              apellido_paterno: '',
              apellido_materno: '',
              telefono: '',
              email: '',
              parentesco: ''
            })}
            className={styles.addButton}
          >
            Nuevo Tutor
          </button>
        </div>
      )}

      {(editTutor || !selectedStudent) && (
        <TutorForm
          tutor={editTutor}
          onSave={handleSaveTutor}
          onCancel={() => setEditTutor(null)}
        />
      )}

      {selectedStudent && tutors.length > 0 && (
        <TutorList
          tutors={tutors}
          onEdit={setEditTutor}
          onDelete={async (curp: any) => {
            try {
              await axios.delete(`http://localhost:3307/api/tutors/${curp}`);
              loadTutors(selectedStudent.curp);
            } catch (error) {
              setAlert({ message: 'Error eliminando tutor', type: 'error' });
            }
          }}
        />
      )}

      <StudentSearchModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSelect={handleStudentSelect}
      />
    </motion.div>
  );
};

export default ManageTutors;