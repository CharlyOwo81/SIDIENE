import React from 'react';
import { motion } from 'framer-motion';
import styles from './ManageTutors.module.css';
import GoBackButton from '../../assets/components/Button/GoBackButton';

interface TutorListProps {
  tutors: any[];
  onEdit: (tutor: any) => void;
  onDelete: (curp: string) => void;
}

const TutorList: React.FC<TutorListProps> = ({ tutors}) => {
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
          </tr>
        </thead>
        <tbody>
          {tutors.map(tutor => (
            <tr key={tutor.curp}>
              <td>{tutor.nombres} {tutor.apellido_paterno} {tutor.apellido_materno}</td>
              <td>{tutor.parentesco}</td>
              <td>{tutor.telefono || 'N/A'}</td>
              <td>{tutor.email || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TutorList;