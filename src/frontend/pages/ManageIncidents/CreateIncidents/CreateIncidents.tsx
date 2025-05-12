// CreateIncidents.tsx
import React, { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../../assets/components/Alert/Alert";
import Navbar from "../../../assets/components/Navbar/IncidentsNavbar";
import CreateIncidenteForm from "./CreateIncidentsForm";
import styles from './CreateIncidents.module.css';
import { motivosPorSeveridad } from "../../../../backend/constants/incidenceOptions";

const fechaSonora = new Date();
fechaSonora.setHours(fechaSonora.getUTCHours() - 7);

const CreateIncidents: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    grado: "",
    grupo: "",
    // Ajusta la fecha UTC a la hora de Sonora (UTC-7)
    fecha: fechaSonora.toISOString().split('T')[0],
    nivelSeveridad: "",
    motivo: "",
    descripcion: "",
    usuario: localStorage.getItem("nombreCompleto") || "Usuario no identificado",
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectStudent = (student: any) => {
    if (!student) return;
  
    setSelectedStudent(student);
    setFormData(prev => ({
      ...prev,
      curp: student.curp,
      nombres: student.nombres,
      apellidoPaterno: student.apellidoPaterno,
      apellidoMaterno: student.apellidoMaterno,
      grado: student.grado,
      grupo: student.grupo,
    }));
    setShowModal(false);
  };  

  const handleOpenModal = async () => {
    if (formData.grado && formData.grupo) {
      try {
        const response = await axios.get(
          `http://localhost:3307/api/students?grado=${formData.grado}&grupo=${formData.grupo}`
        );
  
        // Check for successful response structure
        if (response.data.success && Array.isArray(response.data.data)) {
          setStudents(response.data.data);
          setShowModal(true);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
  
      } catch (error) {
        setAlert({
          message: "No se pudo obtener la lista de estudiantes.",
          type: "error",
        });
        setStudents([]); // Reset students array
      }
    } else {
      setAlert({
        message: "Por favor, seleccione grado y grupo primero.",
        type: "warning",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const incidentData = {
      id_estudiante: formData.curp,
      id_personal: localStorage.getItem("curp") || "",
      fecha: formData.fecha,
      nivel_severidad: formData.nivelSeveridad, // Nombre correcto
      motivo: formData.motivo,
      descripcion: formData.descripcion
    };
  
    try {
      const response = await axios.post(
        "http://localhost:3307/api/incidences/", // Ruta correcta
        incidentData,
        { headers: { "Content-Type": "application/json" } }
      );

      setAlert({
        message: response.data.warning,
        type: "warning",
      })
      
      setAlert({ 
        message: response.data.message || "Incidencia registrada exitosamente", 
        type: "success" 
      });
      
      // Resetear formulario
      setFormData({
        curp: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        grado: "",
        grupo: "",
        fecha: fechaSonora.toISOString().split('T')[0],
        nivelSeveridad: "",
        motivo: "",
        descripcion: "",
        usuario: localStorage.getItem("nombreCompleto") || "",
      });
      setSelectedStudent(null);
  
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || "Error al procesar la petición",
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
      <Navbar />
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <CreateIncidenteForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleOpenModal={handleOpenModal}
        handleInputChange={handleInputChange}
        isSubmitting={isSubmitting}
        selectedStudent={selectedStudent}
        students={students}
        showModal={showModal}
        setShowModal={setShowModal}
        handleSelectStudent={handleSelectStudent}
      />
    </motion.section>
  );
};

export default CreateIncidents;