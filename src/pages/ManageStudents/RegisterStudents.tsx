import React, { useState } from "react";
import { motion } from "framer-motion";
import StudentForm from "./RegisterStudentsForm";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import Alert from "../../assets/components/Alert/Alert";
import styles from "./ManageStudents.module.css";
import {
  createStudent,
  uploadStudentsFromPdf,
} from "../../services/studentsApi";

const RegisterStudents: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    grado: "",
    grupo: "",
    anio_ingreso: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    details?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    setAlert(null);

    try {
      let response;
      if (file) {
        response = await uploadStudentsFromPdf(file);
        if (response.data?.errors) {
          setAlert({
            message: `Procesado con ${response.data.errors.length} errores`,
            type: "warning",
            details: response.data.errors.join("\n"),
          });
        } else {
          setAlert({
            message: `${response.data.valid} estudiantes procesados (${response.data.created} nuevos, ${response.data.updated} actualizados)`,
            type: "success",
          });
        }
      } else {
        response = await createStudent({
          curp: formData.curp,
          nombres: formData.nombres,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
          grado: formData.grado,
          grupo: formData.grupo,
          anio_ingreso: formData.anio_ingreso,
        });
        setAlert({
          message: "¡El estudiante ha sido registrado!",
          type: "success",
        });
      }

      setFormData({
        curp: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        grado: "",
        grupo: "",
        anio_ingreso: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Submission error:", error);
      setAlert({
        message:
          error instanceof Error
            ? error.message
            : "Error procesando la solicitud",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
        setFormData={setFormData}
        formData={formData}
        file={file}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange} // Use this for all inputs and selects
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
    </motion.section>
  );
};

export default RegisterStudents;
