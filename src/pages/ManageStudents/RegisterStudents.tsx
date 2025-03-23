import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./ManageStudents.module.css";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import FormSection from "../../assets/components/FormSection/FormSection";
import Alert from "../../assets/components/Alert/Alert";
import GoBackButton from "../../assets/components/Button/GoBackButton";

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
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    if (file) {
      formDataToSend.append("file", file);
    }
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );

    try {
      const response = await axios.post(
        "http://localhost:3307/api/students/register", // Updated endpoint
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setAlert({ message: response.data.message, type: "success" });
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
      setAlert({
        message:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : axios.isAxiosError(error) && error.request
            ? "No response from server."
            : "Error processing the request.",
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
        <h2 className={styles.formTitle}>Registrar Estudiantes</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Información del Estudiante</legend>

            <FormSection title="Información Personal">
              <InputField
                type="text"
                name="curp"
                placeholder="CURP"
                value={formData.curp}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
              />
            </FormSection>

            <FormSection title="Información Escolar">
              <InputField
                type="text"
                name="grado"
                placeholder="Grado"
                value={formData.grado}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="grupo"
                placeholder="Grupo"
                value={formData.grupo}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="anio_ingreso"
                placeholder="Año de Ingreso"
                value={formData.anio_ingreso}
                onChange={handleInputChange}
              />
            </FormSection>

            <div className={styles.fileUpload}>
              <label htmlFor="file-upload" className={styles.fileLabel}>
                Subir PDF con Datos
              </label>
              <input
                type="file"
                id="file-upload"
                name="file"
                onChange={handleFileChange}
                className={styles.input} // Use CSS class directly
              />
            </div>

            <div className={styles.buttonContainer}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span> Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              <GoBackButton />
            </div>
          </fieldset>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default RegisterStudents;