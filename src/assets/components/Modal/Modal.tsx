import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Modal.module.css";

interface ModalProps {
  students: any[];
  onClose: () => void;
  onSelectStudent: (student: any) => void;
  isOpen: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  students,
  onClose,
  onSelectStudent,
  isOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  useEffect(() => {
    const filtered = students.filter((student) =>
      `${student.nombres} ${student.apellidoPaterno || student.apellido_paterno} ${student.apellidoMaterno || student.apellido_materno} ${student.curp}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

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
                        onClick={() => onSelectStudent(student)}
                        className={styles.studentRow}
                      >
                        <td>
                          <input
                            type="radio"
                            name="selectedStudent"
                            onChange={() => onSelectStudent(student)}
                          />
                        </td>
                        <td>
                          {`${student.nombres} ${student.apellidoPaterno || student.apellido_paterno || ''} ${student.apellidoMaterno || student.apellido_materno || ''}`}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;