import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./ManageStudents.module.css";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import Alert from "../../assets/components/Alert/Alert";
import SearchStudentForm from "./SearchStudentForm";
import UpdateStudentForm from "./UpdateStudentForm";

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  estatus: string;
}

const UpdateStudents: React.FC = () => {
  const [searchCurp, setSearchCurp] = useState("");
  const [formData, setFormData] = useState<Student | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchCurp(e.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.get(`http://localhost:3307/api/students/${searchCurp}`);
  
      if (response.data) {
        setFormData(response.data); // Ensure the response matches the Student interface
        setAlert({
          message: "Estudiante encontrado.",
          type: "success",
        });
      } else {
        setFormData(null);
        setAlert({
          message: "No se encontró un estudiante con ese CURP.",
          type: "warning",
        });
      }
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message ||
          (error.request
            ? "Sin respuesta del servidor."
            : "Error al buscar el estudiante."),
        type: "error",
      });
      setFormData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.put(
        `http://localhost:3307/api/students/${formData.curp}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
      setAlert({
        message: response.data.message || "Estudiante actualizado con éxito.",
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message ||
          (error.request
            ? "Sin respuesta del servidor."
            : "Error al actualizar el estudiante."),
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className={styles.container}
      >
        <h2 className={styles.formTitle}>Actualizar Estudiantes</h2>

        <SearchStudentForm
          searchCurp={searchCurp}
          isLoading={isLoading}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearch}
        />

        {formData && (
          <UpdateStudentForm
            formData={formData}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setFormData(null)}
          />
        )}
      </motion.div>
    </motion.section>
  );
};

export default UpdateStudents;