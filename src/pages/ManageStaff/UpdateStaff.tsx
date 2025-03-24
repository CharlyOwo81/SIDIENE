// src/components/ManageStaff.tsx
import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Alert from "../../assets/components/Alert/Alert";
import StaffNavbar from "../../assets/components/Navbar/StaffNavbar"; // New Navbar
import styles from "./AddStaff.module.css";
import { createStaff } from "../../services/staffApi";

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

const UpdateStaff: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    rol: "",
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.curp ||
      !formData.nombre ||
      !formData.apellidoPaterno ||
      !formData.telefono ||
      !formData.rol
    ) {
      setAlert({
        message: "Por favor, completa todos los campos obligatorios.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const datosFormulario = {
      id: "",
      curp: formData.curp,
      nombre: formData.nombre,
      apellido: `${formData.apellidoPaterno} ${formData.apellidoMaterno || ""}`.trim(),
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno || null,
      telefono: formData.telefono,
      rol: formData.rol,
      puesto: "",
    };

    try {
      const response = await createStaff(datosFormulario);
      setAlert({
        message: `Personal registrado exitosamente.`,
        type: "success",
      });
      setFormData({
        curp: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        rol: "",
      });
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      setAlert({
        message: error.message || "Ocurrió un error al registrar personal.",
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
      transition={{ duration: 0.6, ease: "easeOut" }} // Adjusted timing
      className={styles.mainContainer}
    >
      <StaffNavbar /> {/* Replace h1 with StaffNavbar */}

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer} // Add alert container class
        >
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }} // Match RegisterStudents
        className={styles.containerRight}
      >
        <h2>Ingresar de manera manual</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <legend>Datos Personales</legend>
            <InputField
              type="text"
              name="curp"
              placeholder="CURP *"
              value={formData.curp}
              onChange={(e) => setFormData({ ...formData, curp: e.target.value })}
            />
            <InputField
              type="text"
              name="nombre"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <InputField
              type="text"
              name="apellidoPaterno"
              placeholder="Apellido Paterno *"
              value={formData.apellidoPaterno}
              onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
            />
            <InputField
              type="text"
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={formData.apellidoMaterno}
              onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
            />
            <InputField
              type="text"
              name="telefono"
              placeholder="Teléfono *"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
              <option value="">Seleccione un rol *</option>
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

export default UpdateStaff;