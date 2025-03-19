import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../../components/Alert/Alert";
import Modal from "../../../components/Modal/Modal";
import styles from "./ReadIncidents.module.css";
import PDFViewer from "../../../components/PDFViewer/PDFViewer";
import jsPDF from "jspdf";
import { pdfjs } from "react-pdf";

// Define ButtonProps interface
interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const generatePDF = (data: any) => {
  const doc = new jsPDF();

  doc.text("Nivel de Incidencia: " + data.nivelIncidencia, 10, 20);
  doc.text("Motivo: " + data.motivo, 10, 30);
  doc.text("Descripción: " + data.descripcion, 10, 40);

  // Puedes agregar más contenido según sea necesario
  return doc.output("blob");
};

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

const ReadIncidents: React.FC = () => {
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
    usuario: localStorage.getItem("nombreCompleto") || "",
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Estado para la URL del PDF

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

  // Función para buscar estudiantes con filtros
  const formatDateForBackend = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const fetchFilteredIncidents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/search-incidents",
        {
          params: {
            grado: formData.grado,
            grupo: formData.grupo,
            motivo: formData.motivo,
            nivelSeveridad: formData.nivelSeveridad,
            descripcion: formData.descripcion,
            fecha: formatDateForBackend(formData.fecha),
            nombre: formData.nombres,
            curp: formData.curp,
          },
        }
      );

      if (response.data.length === 0) {
        setAlert({
          message:
            "No se encontraron incidencias con los filtros proporcionados.",
          type: "warning",
        });
      } else {
        setStudents(response.data);
        setShowModal(true); // Mostrar el modal con los resultados de búsqueda
      }
    } catch (error) {
      setAlert({
        message:
          "Error al buscar las incidencias. Por favor, verifica los filtros e intenta nuevamente.",
        type: "error",
      });
      console.error("Error fetching incidents:", error);
    }
  };

  useEffect(() => {
    if (formData.grado && formData.grupo) {
      fetchFilteredIncidents();
    }
  }, [formData]);

  // Función para generar el PDF
  const generatePDF = (incidentData: any) => {
    const doc = new jsPDF();

    // Verifica si los datos están completos
    if (
      !incidentData.nivelSeveridad ||
      !incidentData.motivo ||
      !incidentData.descripcion
    ) {
      console.error("Datos incompletos para generar el PDF");
      return null; // No generar el PDF si falta algún dato
    }

    // Agregar contenido al PDF
    doc.setFontSize(18);
    doc.text("Reporte de Incidencia", 10, 10);
    doc.setFontSize(12);
    doc.text(`CURP: ${incidentData.curp}`, 10, 20);
    doc.text(
      `Nombre: ${incidentData.nombres} ${incidentData.apellidoPaterno} ${incidentData.apellidoMaterno}`,
      10,
      30
    );
    doc.text(`Grado: ${incidentData.grado}`, 10, 40);
    doc.text(`Grupo: ${incidentData.grupo}`, 10, 50);
    doc.text(`Fecha: ${incidentData.fecha}`, 10, 60);
    doc.text(`Nivel de Severidad: ${incidentData.nivelSeveridad}`, 10, 70);
    doc.text(`Motivo: ${incidentData.motivo}`, 10, 80);
    doc.text(`Descripción: ${incidentData.descripcion}`, 10, 90);

    // Guardar el PDF como Blob
    const pdfBlob = doc.output("blob");
    return pdfBlob;
  };

  const validateFormForPDF = () => {
    if (!formData.nivelSeveridad || !formData.motivo || !formData.descripcion) {
      setAlert({
        message:
          "Por favor, completa todos los campos antes de generar el PDF.",
        type: "warning",
      });
      return false;
    }
    return true;
  };

  const handleGeneratePDF = useCallback(() => {
    if (!validateFormForPDF()) return;

    const pdfBlob = generatePDF(formData);
    if (!pdfBlob) return;

    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = pdfUrl;
    const fileName = `reporte-incidencia_${formData.fecha}_${formData.apellidoPaterno}_${formData.apellidoMaterno}_${formData.grado}_${formData.grupo}.pdf`;
    link.download = fileName;
    link.click();

    setPdfUrl(pdfUrl);
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (
        !formData.curp ||
        !formData.nivelSeveridad ||
        !formData.motivo ||
        !formData.descripcion
      ) {
        setAlert({
          message: "Todos los campos son obligatorios.",
          type: "warning",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/incidents",
          {
            id_estudiante: formData.curp,
            id_personal: localStorage.getItem("curp") || "",
            fecha: formData.fecha,
            nivel_severidad: formData.nivelSeveridad,
            motivo: formData.motivo,
            descripcion: formData.descripcion,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

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
          fecha: new Date().toLocaleDateString(),
          nivelSeveridad: "",
          motivo: "",
          descripcion: "",
          usuario: localStorage.getItem("nombreCompleto") || "",
        });
        setPdfUrl(null);
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
    },
    [formData]
  );

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

          {/* Botón para generar el PDF */}
          <div className={styles.buttonContainer}>
            <Button
              type="button"
              onClick={handleGeneratePDF}
              disabled={isSubmitting}
            >
              Generar PDF
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Mostrar el visor de PDF */}
      {pdfUrl && (
        <div className={styles.pdfViewerContainer}>
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      )}

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

export default ReadIncidents;
