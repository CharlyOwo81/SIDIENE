import React, { useState, ChangeEvent } from "react";
import styles from "./ManageStudents.module.css";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../components/Alert/Alert";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
}) => (
  <motion.input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    whileFocus={{ scale: 1.05 }}
    className={styles.input}
  />
);

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  children,
  disabled,
}) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.9 }}
    className={styles.button}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

const ManageStudents: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    grado: "",
    grupo: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const studentData = {
    curp: formData.curp,
    nombres: formData.nombres,
    apellidoPaterno: formData.apellidoPaterno,
    apellidoMaterno: formData.apellidoMaterno,
    grado: formData.grado,
    grupo: formData.grupo,
  };

  try {
    let response;
    if (file) {
      // Si se cargó un archivo, enviarlo junto con los datos del formulario
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("data", JSON.stringify(studentData));

      response = await axios.post(
        "http://localhost:5000/uploadStudents",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      // Si no se cargó un archivo, enviar solo los datos del formulario
      response = await axios.post(
        "http://localhost:5000/ManageStudents",
        studentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    setAlert({
      message: response.data.message,
      type: "success",
    });

    setFormData({
      curp: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      grado: "",
      grupo: "",
    });
    setFile(null);
  } catch (error: any) {
    console.error("Error registrando los datos:", error);
    let errorMessage = "Un error ocurrió cuando se procesaba la petición.";
    if (error.response) {
      errorMessage =
        error.response.data.message || "Error desconocido del servidor.";
    } else if (error.request) {
      errorMessage = "Sin respuesta del servidor.";
    }
    setAlert({
      message: errorMessage,
      type: "error",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.mainContainer}
    >
      <h1>Manage Students Elementary School</h1>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.containerRight}
      >
        <h2>Registrar alumnado</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <legend>Información del o la Estudiante</legend>
            <InputField
              type="text"
              name="curp"
              placeholder="CURP"
              value={formData.curp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, curp: e.target.value })
              }
            />

            {/* Contenedor flexible para Nombres, Apellido Paterno y Apellido Materno */}
            <div className={styles.row}>
              <InputField
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, nombres: e.target.value })
                }
              />
              <InputField
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, apellidoPaterno: e.target.value })
                }
              />
              <InputField
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, apellidoMaterno: e.target.value })
                }
              />
            </div>

            {/* Contenedor flexible para Grado y Grupo */}
            <div className={styles.row}>
              <InputField
                type="text"
                name="grado"
                placeholder="Grade"
                value={formData.grado}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, grado: e.target.value })
                }
              />
              <InputField
                type="text"
                name="grupo"
                placeholder="Section"
                value={formData.grupo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, grupo: e.target.value })
                }
              />
            </div>

            <div className={styles.fileUpload}>
              <label htmlFor="file-upload">
                Upload PDF with Students Data:
              </label>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </fieldset>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ManageStudents;
