import React from 'react';
import { motion } from 'framer-motion';
import styles from './ManageTutors.module.css';

interface TutorListProps {
  tutors: any[];
  onEdit: (tutor: any) => void;
  onDelete: (curp: string) => void;
}

const TutorList: React.FC<TutorListProps> = ({ tutors, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.tutorTable}
    >
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Parentesco</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map(tutor => (
            <tr key={tutor.curp}>
              <td>{tutor.nombres} {tutor.apellido_paterno} {tutor.apellido_materno}</td>
              <td>{tutor.parentesco}</td>
              <td>{tutor.telefono || 'N/A'}</td>
              <td>{tutor.email || 'N/A'}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(tutor)}
                >
                  Editar
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(tutor.curp)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TutorList;