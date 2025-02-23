import React, { useState } from "react";
import styles from "./AddStaff.module.css";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../components/Alert/Alert"; // Import Alert component

// Componente reutilizable para los campos del formulario
interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

// Componente reutilizable para el botón
interface ButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  children: React.ReactNode;
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
    rol: "", // Valor por defecto
  });

  const [archivo, setArchivo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datosFormulario = {
      curp: formData.curp,
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      rol: formData.rol,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/ManageStaff", // Asegúrate de que esta ruta coincida con el servidor
        datosFormulario, // Enviar como JSON
        {
          headers: { "Content-Type": "application/json" }, // Especificar el tipo de contenido
        }
      );
      console.log("Respuesta del servidor:", response.data);
      alert("Personal registrado exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al registrar personal");
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!archivo) {
      alert("No se ha seleccionado ningún archivo");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("archivo", archivo);

    try {
      const response = await axios.post(
        "http://localhost:5000/procesar-pdf",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Respuesta del servidor:", response.data);
      alert("Archivo procesado exitosamente");
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      alert("Error al procesar el archivo");
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitData = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("apellidoPaterno", formData.apellidoPaterno);
    formDataToSend.append("apellidoMaterno", formData.apellidoMaterno);
    formDataToSend.append("rol", formData.rol);
    if (archivo) formDataToSend.append("archivo", archivo);

    try {
      const response = await axios.post(
        "http://localhost:5000/ManageStaff",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  // Manejar la selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
      console.log("Archivo seleccionado:", e.target.files[0].name);
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

      {/* Carga de archivo */}
      <div className={styles.containerLeft}>
        <h2>Ingresar de manera automatizada</h2>
        <h5>Se admiten archivos Excel y PDF</h5>
        <input
          type="file"
          name="excelStaff"
          id="excelStaff"
          accept=".xlsx, .xls, .pdf"
          onChange={handleFileChange}
          className={styles.inputFile}
        />
        <Button type="submit">Guardar</Button>
      </div>

      {/* Formulario para ingresar personal */}
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
              onChange={handleChange}
            />
            <InputField
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            <InputField
              type="text"
              name="apellidoPaterno"
              placeholder="Apellido Paterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
            />
            <InputField
              type="text"
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
            />
            <legend>Información Laboral</legend>
            <motion.select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
              className={styles.select}
            >
              <option value="DIRECTIVO">DIRECTIVO</option>
              <option value="PREFECTO">PREFECTO</option>
              <option value="DOCENTE">DOCENTE</option>
              <option value="TRABAJADOR SOCIAL">TRABAJADOR SOCIAL</option>
            </motion.select>
            <Button type="submit">Guardar</Button>
          </fieldset>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ManageStaff;
