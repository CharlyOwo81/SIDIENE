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
import { updateStudent } from '../../services/studentsApi';

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get("http://localhost:3307/api/students/updateStudents", {
        params: { curp: searchCurp },
      });

      if (response.data.student) {
        setFormData(response.data.student);
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
        "http://localhost:5000/updateStudent",
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
        <form onSubmit={handleSearch} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Buscar Estudiante</legend>
            <FormSection title="CURP del Estudiante">
              <InputField
                type="text"
                name="curp"
                placeholder="Ingrese el CURP"
                value={searchCurp}
                onChange={handleSearchChange}
              />
            </FormSection>
            <div className={styles.buttonContainer}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span> Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
              <GoBackButton />
            </div>
          </fieldset>
        </form>

        {formData && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Actualizar Datos</legend>

              <FormSection title="Información Personal">
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

              <div className={styles.buttonContainer}>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span> Actualizando...
                    </>
                  ) : (
                    "Actualizar"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormData(null)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </fieldset>
          </form>
        )}
      </motion.div>
    </motion.section>
  );
};

export default UpdateStudents;