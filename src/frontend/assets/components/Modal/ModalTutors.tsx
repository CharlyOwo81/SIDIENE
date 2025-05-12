import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';

interface ModalProps {
  students: any[];
  onClose: () => void;
  onSelectStudent: (student: any) => void;
  isOpen: boolean;
  selectedStudents: string[];
  children?: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  students,
  onClose,
  onSelectStudent,
  isOpen,
  selectedStudents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  useEffect(() => {
    const filtered = students.filter((student) =>
      `${student.nombres} ${student.apellido_paterno || ''} ${student.apellido_materno || ''} ${student.curp}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // Modified to close the modal after selection
  const handleSelectAndClose = (student: any) => {
    onSelectStudent(student); // Call the selection handler
    onClose(); // Close the modal
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.modalHeader}>
              <h2>Seleccionar Estudiante</h2>
              <button onClick={onClose} className={styles.closeButton}>
                ×
              </button>
            </div>

            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.studentList}>
              {filteredStudents.length > 0 ? (
                <table className={styles.studentTable}>
                  <thead>
                    <tr>
                      <th>Seleccionar</th>
                      <th>Nombre Completo</th>
                      <th>CURP</th>
                      <th>Grado/Grupo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.curp}
                        className={styles.studentRow}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.curp)}
                            onChange={() => handleSelectAndClose(student)} // Updated handler
                          />
                        </td>
                        <td>
                          {`${student.nombres} ${student.apellidoPaterno || ''} ${student.apellidoMaterno || ''}`}
                        </td>
                        <td>{student.curp}</td>
                        <td>{`${student.grado}° ${student.grupo}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noResults}>
                  <p>No se encontraron estudiantes</p>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={onClose} className={styles.confirmButton}>
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;