import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ModalTutores.module.css';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutors: any[];
  onSelectTutor: (tutor: any) => void;
}

const TutorModal: React.FC<TutorModalProps> = ({ isOpen, onClose, tutors, onSelectTutor }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <div className={styles.modalHeader}>
              <h3>Tutores registrados</h3>
              <button onClick={onClose} className={styles.closeButton}>×</button>
            </div>
            
            <div className={styles.tutorList}>
              {tutors.map(tutor => (
                <div key={tutor.curp} className={styles.tutorItem}>
                  <span>{tutor.nombres} {tutor.apellido_paterno} {tutor.apellido_materno}</span>
                  <button 
                    className={styles.editButton}
                    onClick={() => onSelectTutor(tutor)}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorModal;