// RegisterStudents.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StudentForm from './RegisterStudentsForm';
import Navbar from '../../assets/components/Navbar/StudentsNavbar';
import Alert from '../../assets/components/Alert/Alert';
import styles from './ManageStudents.module.css';
import { createStudent } from '../../services/studentsApi'; // Import the service

const RegisterStudents: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    grado: '',
    grupo: '',
    anio_ingreso: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the API to create a student
      await createStudent(formData);
      setAlert({ message: 'Student created successfully!', type: 'success' });
      // Reset the form after successful submission
      setFormData({
        curp: '',
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        grado: '',
        grupo: '',
        anio_ingreso: '',
      });
      setFile(null);
    } catch (error) {
      setAlert({ message: error instanceof Error ? error.message : 'An unknown error occurred', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={styles.mainContainer}
    >
      <Navbar />

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

      <StudentForm
        formData={formData}
        file={file}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </motion.section>
  );
};

export default RegisterStudents;