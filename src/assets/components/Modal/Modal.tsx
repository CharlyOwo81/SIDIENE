import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar framer-motion
import styles from "./Modal.module.css";

interface ModalProps {
  students: any[];
  onClose: () => void;
  onSelectStudent: (student: any) => void;
  isOpen: boolean; // Prop para controlar la visibilidad del modal
}

const Modal: React.FC<ModalProps> = ({
  students,
  onClose,
  onSelectStudent,
  isOpen,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }} // Estado inicial de la animación
          animate={{ opacity: 1 }} // Estado animado
          exit={{ opacity: 0 }} // Estado al salir
          transition={{ duration: 0.3 }} // Duración de la animación
        >
          <motion.div
            className={styles.modalContent}
            initial={{ y: -50, opacity: 0 }} // Estado inicial de la animación
            animate={{ y: 0, opacity: 1 }} // Estado animado
            exit={{ y: 50, opacity: 0 }} // Estado al salir (cae hacia abajo)
            transition={{ duration: 0.3 }} // Duración de la animación
          >
            <h2>Selecciona un estudiante</h2>
            <button onClick={onClose} className={styles.closeButton}>
              X
            </button>
            <div className={styles.studentList}>
              {students.length > 0 ? (
                <table className={styles.studentTable}>
                  <thead>
                    <tr>
                      <th>Seleccionar</th>
                      <th>Nombre</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Grado</th>
                      <th>Grupo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.curp}
                        onClick={() => onSelectStudent(student)}
                        className={styles.studentRow}
                      >
                        <td>
                          <input
                            type="radio"
                            name="selectedStudent"
                            title="Seleccionar estudiante"
                            onChange={() => onSelectStudent(student)}
                          />
                        </td>
                        <td>{student.nombre}</td>
                        <td>{student.apellido_paterno}</td>
                        <td>{student.apellido_materno}</td>
                        <td>{student.grado}</td>
                        <td>{student.grupo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron estudiantes.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
