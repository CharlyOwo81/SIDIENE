import React, { useState, ChangeEvent } from "react";
import styles from "./AddStaff.module.css";
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

const Button: React.FC<ButtonProps> = ({ type, onClick, children }) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.9 }}
    className={styles.button}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const ManageStaff: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    rol: "",
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const datosFormulario = {
      curp: formData.curp,
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      rol: formData.rol,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/ManageStaff",
        datosFormulario,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setAlert({
        message: `Personal registrado exitosamente. Rol: ${response.data.rol}, Contraseña: ${response.data.contrasena}`,
        type: "success",
      });

      setFormData({
        curp: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        rol: "",
      });
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      let errorMessage = "Ocurrió un error al registrar personal.";
      if (error.response) {
        errorMessage =
          error.response.data.message || "Error desconocido del servidor.";
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor.";
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
      <h1>Gestionar Personal</h1>

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
        <h2>Ingresar de manera manual</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <legend>Datos Personales</legend>
            <InputField
              type="text"
              name="curp"
              placeholder="CURP"
              value={formData.curp}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, curp: e.target.value })
              }
            />
            <InputField
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, nombre: e.target.value })
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
            <legend>Información Laboral</legend>
            <motion.select
              name="rol"
              value={formData.rol}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, rol: e.target.value })
              }
              whileFocus={{ scale: 1.05 }}
              className={styles.select}
            >
              <option value="DIRECTIVO">DIRECTIVO</option>
              <option value="PREFECTO">PREFECTO</option>
              <option value="DOCENTE">DOCENTE</option>
              <option value="TRABAJADOR SOCIAL">TRABAJADOR SOCIAL</option>
            </motion.select>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </fieldset>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ManageStaff;
