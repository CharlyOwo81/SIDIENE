import React, { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../../components/Alert/Alert";
import Modal from "../../../components/Modal/Modal";
import styles from "./CreateIncidents.module.css";

// InputField component for input elements
interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  label,
}) => (
  <div>
    {label && <label>{label}</label>}
    <motion.input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

// Button component for button elements
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
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

// ManageIncidents component
const CreateIncidents: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    grado: "",
    grupo: "",
    fecha: new Date().toLocaleDateString(),
    nivelSeveridad: "",
    motivo: "",
    descripcion: "",
    usuario: localStorage.getItem("nombreCompleto") || "", // Obtener el nombre del usuario desde localStorage
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Motivos disponibles según el nivel de severidad
  const motivosPorSeveridad: {
    [key in "Leve" | "Severo" | "Grave"]: string[];
  } = {
    Leve: ["Falta de tarea", "Retraso", "Comportamiento inapropiado"],
    Severo: ["Agresión verbal", "Uso de teléfono en clase", "Falta repetida"],
    Grave: ["Agresión física", "Vandalismo", "Acoso escolar"],
  };

  // Maneja la selección de un estudiante
  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      ...formData,
      curp: student.curp,
      nombres: student.nombre,
      apellidoPaterno: student.apellido_paterno,
      apellidoMaterno: student.apellido_materno,
      grado: student.grado,
      grupo: student.grupo,
    });
    setShowModal(false); // Cierra el modal después de seleccionar
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const incidentData = {
      id_estudiante: formData.curp, // CURP del estudiante seleccionado
      id_personal: localStorage.getItem("curp") || "", // CURP del usuario activo
      fecha: formData.fecha, // Fecha del incidente
      nivel_severidad: formData.nivelSeveridad, // Nivel de severidad seleccionado
      motivo: formData.motivo, // Motivo del incidente
      descripcion: formData.descripcion, // Descripción del incidente
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/uploadIncidents",
        incidentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setAlert({
        message: response.data.message,
        type: "success",
      });

      // Reiniciar el formulario
      setFormData({
        curp: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        grado: "",
        grupo: "",
        fecha: new Date().toLocaleDateString(),
        nivelSeveridad: "",
        motivo: "",
        descripcion: "",
        usuario: localStorage.getItem("nombreCompleto") || "",
      });
    } catch (error: any) {
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
  // Consulta automática cuando cambia el grado o el grupo
  useEffect(() => {
    if (formData.grado && formData.grupo) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/students?grado=${formData.grado}&grupo=${formData.grupo}`
          );
          setStudents(response.data);
          setShowModal(true); // Mostrar el modal inmediatamente
        } catch (error) {
          setAlert({
            message: "No se pudo obtener la lista de estudiantes.",
            type: "error",
          });
        }
      };

      fetchStudents();
    }
  }, [formData.grado, formData.grupo]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.mainContainer}
    >
      <h1 className={styles.title}>Registrar Incidencias</h1>

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
        className={styles.formContainer}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Fila 1: CURP y Fecha */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>CURP</label>
              <motion.input
                type="text"
                name="curp"
                placeholder="CURP"
                value={formData.curp}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha</label>
              <motion.input
                type="text"
                name="fecha"
                placeholder="Fecha"
                value={formData.fecha}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
          </div>

          {/* Fila 2: Nombre del usuario, Grado y Grupo */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre del Usuario</label>
              <motion.input
                type="text"
                name="usuario"
                placeholder="Nombre del usuario"
                value={formData.usuario}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Grado</label>
              <select
                value={formData.grado}
                onChange={(e) => {
                  setFormData({ ...formData, grado: e.target.value });
                }}
                className={styles.select}
              >
                <option value="">Seleccionar grado</option>
                <option value="1">1º Grado</option>
                <option value="2">2º Grado</option>
                <option value="3">3º Grado</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Grupo</label>
              <select
                value={formData.grupo}
                onChange={(e) => {
                  setFormData({ ...formData, grupo: e.target.value });
                }}
                className={styles.select}
              >
                <option value="">Seleccionar grupo</option>
                <option value="A">Grupo A</option>
                <option value="B">Grupo B</option>
                <option value="C">Grupo C</option>
                <option value="D">Grupo D</option>
                <option value="E">Grupo E</option>
                <option value="F">Grupo F</option>
              </select>
            </div>
          </div>

          {/* Resto del formulario */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombres</label>
              <motion.input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Apellido Paterno</label>
              <motion.input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Apellido Materno</label>
              <motion.input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno}
                onChange={() => {}}
                disabled
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.lastRow}>
            {/* Radio buttons a la izquierda */}
            <div className={styles.severityCell}>
              <label className={styles.label}>Nivel de Severidad</label>
              <div className={styles.radioGroup}>
                {["Leve", "Severo", "Grave"].map((nivel) => (
                  <label key={nivel} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="nivelSeveridad"
                      value={nivel}
                      checked={formData.nivelSeveridad === nivel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelSeveridad: e.target.value,
                        })
                      }
                    />
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            {/* Motivo y descripción a la derecha */}
            <div className={styles.motivoDescripcionCell}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Motivo</label>
                <select
                  value={formData.motivo}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo: e.target.value })
                  }
                  className={styles.select}
                >
                  <option value="">Seleccionar motivo</option>
                  {formData.nivelSeveridad &&
                    motivosPorSeveridad[
                      formData.nivelSeveridad as "Leve" | "Severo" | "Grave"
                    ].map((motivo) => (
                      <option key={motivo} value={motivo}>
                        {motivo}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Descripción del Incidente
                </label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción del incidente"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* Botón de enviar */}
          <div className={styles.buttonContainer}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </motion.div>

      {showModal && (
        <Modal
          students={students}
          onClose={() => setShowModal(false)}
          onSelectStudent={handleSelectStudent}
          isOpen={showModal}
        />
      )}
    </motion.section>
  );
};

export default CreateIncidents;
