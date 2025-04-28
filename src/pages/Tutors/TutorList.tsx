import React from 'react';
import { motion } from 'framer-motion';
import styles from './TutorList.module.css';

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
      className={styles.tutorList}
    >
      <div className={styles.tableWrapper}>
        <table className={styles.tutorListTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Parentesco</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor, index) => (
              <motion.tr
                key={tutor.curp}
                className={styles.tutorRow}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <td>{`${tutor.nombres} ${tutor.apellido_paterno} ${tutor.apellido_materno}`}</td>
                <td>{tutor.parentesco}</td>
                <td>{tutor.telefono || 'N/A'}</td>
                <td>{tutor.email || 'N/A'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TutorList;