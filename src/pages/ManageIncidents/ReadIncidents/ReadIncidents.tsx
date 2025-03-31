import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../../assets/components/Alert/Alert";
import PDFModal from "../../../assets/components/Modal/PDFModal";
import styles from "./ReadIncidents.module.css";
import jsPDF from "jspdf";
import Navbar from "../../../assets/components/Navbar/IncidentsNavbar";
import { pdfjs } from "react-pdf";
interface Incident {
  id_incidencia: number;
  fecha: string;
  nivel_severidad: string;
  motivo: string;
  descripcion: string;
  nombre_estudiante: string;
  grado: string;
  grupo: string;
  nombre_personal: string;
  curp_estudiante: string;
}

const ReadIncidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get("http://localhost:3307/api/incidences");
        setIncidents(response.data.data);
      } catch (error) {
        setAlert({
          message: "Error al cargar las incidencias",
          type: "error"
        });
      }
    };
    fetchIncidents();
  }, []);

  const generateIncidentPDF = (incident: Incident): string => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  
    // Configuración inicial
    const margin = 15;
    let yPosition = margin;
    const pageWidth = 210; // Ancho de página A4 en mm
    const logoLeftWidth = 28;
    const logoRightWidth = 28;
  
    // Helper function to convert hex to RGB for jsPDF
    const hexToRgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
  
    // Color palette from Footer.module.css
    const colors = {
      yellow: "#F3C44D", // Light yellow
      orange: "#E5823E", // Warm orange
      redOrange: "#C26444", // Reddish orange
      deepPink: "#891547", // Deep pink
    };
  
    // 1. CABECERA CON DOS LOGOS Y GRADIENTE
    // Gradient background for header
    //doc.setFillColor(...hexToRgb(colors.yellow));
    //doc.rect(0, 0, pageWidth, 40, "F");
    //doc.setFillColor(...hexToRgb(colors.orange));
    //doc.rect(0, 10, pageWidth, 10, "F");
    //doc.setFillColor(...hexToRgb(colors.redOrange));
    //doc.rect(0, 20, pageWidth, 10, "F");
    //doc.setFillColor(...hexToRgb(colors.deepPink));
    //doc.rect(0, 30, pageWidth, 10, "F");
  
    // Logo izquierdo
    doc.addImage("tecnica56logo.png", "PNG", margin, yPosition, logoLeftWidth, 18);
  
    // Logo derecho
    const logoRightX = pageWidth - margin - logoRightWidth;
    doc.addImage("sonoraLogo.png", "PNG", logoRightX, yPosition, logoRightWidth, 14);
  
    // Área de texto disponible
    const textStartX = margin + logoLeftWidth + 5;
    const textAvailableWidth = pageWidth - (2 * margin) - logoLeftWidth - logoRightWidth - 10;
  
    // Configurar fuentes
    doc.setFont("helvetica");
  
    // Título principal
    doc.setFontSize(16);
    const titleText = "ESCUELA SECUNDARIA TÉCNICA NO. 56";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = textStartX + (textAvailableWidth - titleWidth) / 2;
    doc.text(titleText, titleX, yPosition + 10);
  
    // Nombre de la escuela
    doc.setFontSize(14);
    const schoolName = "'JOSÉ LUIS OSUNA VILLA'";
    const schoolWidth = doc.getTextWidth(schoolName);
    const schoolX = textStartX + (textAvailableWidth - schoolWidth) / 2;
    doc.text(schoolName, schoolX, yPosition + 18);
  
    // Subtítulo
    doc.setFontSize(12);
    const subtitleText = "Sistema de Digitalización de Expedientes e Incidencias para la Nueva Escuela";
    const subtitleLines = doc.splitTextToSize(subtitleText, textAvailableWidth);
    const subtitleY = yPosition + 26;
    subtitleLines.forEach((line: string, index: number) => {
      const lineWidth = doc.getTextWidth(line);
      const lineX = textStartX + (textAvailableWidth - lineWidth) / 2;
      doc.text(line, lineX, subtitleY + index * 7);
    });
  
    // Fecha
    const dateY = subtitleY + subtitleLines.length * 7 + 6;
    const dateText = `PDF generado: ${new Date().toLocaleDateString()}`;
    const dateWidth = doc.getTextWidth(dateText);
    const dateX = textStartX + (textAvailableWidth - dateWidth) / 2;
    doc.text(dateText, dateX, dateY);
  
    // Ajustar posición Y después de la cabecera
    const headerHeight = dateY + 6 - yPosition;
    yPosition += headerHeight + 10;
  
    // 2. SECCIÓN DE DATOS DEL ESTUDIANTE
    doc.setFillColor(...hexToRgb(colors.orange));
    doc.rect(margin, yPosition, 180, 10, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("DATOS DEL ESTUDIANTE", margin + 5, yPosition + 7);
  
    yPosition += 20;
    doc.setTextColor(0, 0, 0); // Reset to black for content
  
    // Datos del estudiante
    const studentData = [
      ["CURP:", incident.curp_estudiante],
      ["Nombre:", incident.nombre_estudiante],
      ["Grado y grupo:", `${incident.grado}° ${incident.grupo}`],
      ["Fecha de incidencia:", new Date(incident.fecha).toLocaleDateString()],
    ];
  
    studentData.forEach(([label, value]) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...hexToRgb(colors.deepPink));
      doc.text(label, margin, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value.toString(), margin + 45, yPosition);
      yPosition += 8;
    });
  
    yPosition += 10;
  
    // 3. DETALLES DE LA INCIDENCIA
    doc.setFillColor(...hexToRgb(colors.redOrange));
    doc.rect(margin, yPosition, 180, 10, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("DETALLES DE LA INCIDENCIA", margin + 5, yPosition + 7);
  
    yPosition += 20;
    doc.setTextColor(0, 0, 0);
  
    // Nivel de severidad con color
    const severityColors: { [key: string]: string } = {
      leve: colors.yellow,
      severo: colors.orange,
      grave: colors.redOrange,
    };
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text("Nivel de severidad:", margin, yPosition);
    doc.setFillColor(...hexToRgb(severityColors[incident.nivel_severidad.toLowerCase()]));
    doc.circle(margin + 50, yPosition - 2, 3, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(incident.nivel_severidad, margin + 60, yPosition);
    yPosition += 10;
  
    // Motivo
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text("Motivo:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(incident.motivo, margin + 20, yPosition);
    yPosition += 10;
  
    // Descripción
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text("Descripción:", margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(incident.descripcion, 170);
    doc.text(descLines, margin, yPosition + 5);
    yPosition += descLines.length * 7 + 15;
  
    // 4. FIRMA Y SELLO
    if (yPosition > 250) doc.addPage();
  
    // Centrar todos los elementos de la sección de firma
    const centerX = pageWidth / 2;

    // Texto "Incidencia registrada por:" centrado
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text("Incidencia registrada por:", centerX, yPosition, { align: "center" });

    // Nombre del personal centrado
    doc.setFontSize(14);
    doc.setFont("helvetica");
    doc.setTextColor(0, 0, 0);
    doc.text(incident.nombre_personal, centerX, yPosition + 8, { align: "center" });

    // Línea de firma centrada (80mm de largo)
    const lineLength = 80;
    doc.setLineWidth(0.3);
    doc.setDrawColor(...hexToRgb(colors.deepPink));
    doc.line(
      centerX - lineLength / 2,  // Comienzo de la línea (centrado)
      yPosition + 20,            // Posición Y
      centerX + lineLength / 2,  // Fin de la línea
      yPosition + 20
    );

    // Texto de firma y sello centrado
    doc.setFontSize(10);
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text("Firma y sello de la Institución", centerX, yPosition + 28, { 
      align: "center",
      fontStyle: "italic"
    });

    // Ajustar posición Y final
    yPosition += 40;
  
    // Footer with gradient
    const footerY = 297 - 20; // Bottom of A4 page minus footer height
    doc.setFillColor(...hexToRgb(colors.yellow));
    doc.rect(0, footerY, pageWidth, 5, "F");
    doc.setFillColor(...hexToRgb(colors.orange));
    doc.rect(0, footerY + 5, pageWidth, 5, "F");
    doc.setFillColor(...hexToRgb(colors.redOrange));
    doc.rect(0, footerY + 10, pageWidth, 5, "F");
    doc.setFillColor(...hexToRgb(colors.deepPink));
    doc.rect(0, footerY + 15, pageWidth, 5, "F");
  
    // Generar URL del PDF
    const pdfBlob = doc.output("blob");
    return URL.createObjectURL(pdfBlob);
  };

  const handleViewPDF = (incident: Incident) => {
    const url = generateIncidentPDF(incident);
    setSelectedIncident(incident);
    setPdfUrl(url);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.nombre_estudiante.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverities.length === 0 || 
      selectedSeverities.includes(incident.nivel_severidad.toLowerCase());
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.mainContainer}
    >
      <Navbar/>
      <h1 className={styles.title}>Historial de Incidencias</h1>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por estudiante, motivo o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filtersContainer}>
        <span>Filtrar por severidad:</span>
        {['LEVE', 'SEVERO', 'GRAVE'].map(severity => (
          <button
            key={severity}
            className={`${styles.severityFilter} ${
              selectedSeverities.includes(severity.toLowerCase()) 
                ? styles.active 
                : ''
            }`}
            onClick={() => {
              const lowerSeverity = severity.toLowerCase();
              setSelectedSeverities(prev =>
                prev.includes(lowerSeverity)
                  ? prev.filter(s => s !== lowerSeverity)
                  : [...prev, lowerSeverity]
              );
            }}
          >
            {severity}
          </button>
        ))}
          <div className={styles.calendarContainer}>
          </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.incidentsTable}>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Fecha</th>
              <th>Severidad</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident) => (
              <tr key={incident.id_incidencia}>
                <td>{incident.nombre_estudiante}</td>
                <td>{new Date(incident.fecha).toLocaleDateString()}</td>
                <td className={styles[incident.nivel_severidad.toLowerCase()]}>
                  {incident.nivel_severidad}
                </td>
                <td>{incident.motivo}</td>
                <td>
                  <motion.button
                    className={styles.pdfButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewPDF(incident)}
                  >
                    Ver PDF
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

<PDFModal  
isOpen={!!pdfUrl}  
onClose={() => {    
setPdfUrl(null);    
setSelectedIncident(null);  
}}  
pdfUrl={pdfUrl}  
/>
    </motion.section>
  );
};

export default ReadIncidents;