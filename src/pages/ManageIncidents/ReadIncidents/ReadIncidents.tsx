import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../../assets/components/Alert/Alert";
import PDFModal from "../../../assets/components/Modal/PDFModal";
import styles from "./ReadIncidents.module.css";
import jsPDF from "jspdf";
import Navbar from "../../../assets/components/Navbar/IncidentsNavbar";
import IncidentsTable from "./IncidentsTable";

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
          type: "error",
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

  doc.setFont("helvetica", "normal");
  const margin = 15;
  let yPosition = margin;
  const pageWidth = 210;

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const colors = {
    yellow: "#F3C44D",
    orange: "#E5823E",
    redOrange: "#C26444",
    deepPink: "#891547",
  };

  // Header
  doc.addImage("tecnica56logo.png", "PNG", margin, yPosition, 28, 18);
  doc.addImage("sonoraLogo.png", "PNG", pageWidth - margin - 28, yPosition, 28, 14);

  const textStartX = margin + 33;
  const textAvailableWidth = pageWidth - (2 * margin) - 56 - 10;

  doc.setFont("helvetica");
  doc.setFontSize(16);
  const titleText = "ESCUELA SECUNDARIA TÉCNICA NO. 56";
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, textStartX + (textAvailableWidth - titleWidth) / 2, yPosition + 10);

  doc.setFontSize(14);
  const schoolName = "'JOSÉ LUIS OSUNA VILLA'";
  const schoolWidth = doc.getTextWidth(schoolName);
  doc.text(schoolName, textStartX + (textAvailableWidth - schoolWidth) / 2, yPosition + 18);

  doc.setFontSize(12);
  const subtitleText = "Sistema de Digitalización de Expedientes e Incidencias para la Nueva Escuela";
  const subtitleLines = doc.splitTextToSize(subtitleText, textAvailableWidth);
  const subtitleY = yPosition + 26;
  subtitleLines.forEach((line: string, index: number) => {
    const lineWidth = doc.getTextWidth(line);
    doc.text(line, textStartX + (textAvailableWidth - lineWidth) / 2, subtitleY + index * 7);
  });

  const dateText = `PDF generado: ${new Date().toLocaleDateString()}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, textStartX + (textAvailableWidth - dateWidth) / 2, subtitleY + subtitleLines.length * 7 + 6);

  yPosition += 50;

  // Student Data Section
  doc.setFillColor(...hexToRgb(colors.orange));
  doc.rect(margin, yPosition, 180, 10, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DATOS DEL ESTUDIANTE", margin + 5, yPosition + 7);

  yPosition += 20;
  doc.setTextColor(0, 0, 0);

  const studentData = [
    ["Nombre:", incident.nombre_estudiante || "N/A"],
    ["CURP:", incident.curp_estudiante || "N/A"],
    ["Grado y grupo:", incident.grado && incident.grupo ? `${incident.grado}° ${incident.grupo}` : "N/A"],
    ["Fecha de la incidencia:", incident.fecha ? new Date(incident.fecha).toLocaleDateString() : "N/A"],
  ];

  studentData.forEach(([label, value]) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(colors.deepPink));
    doc.text(label, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin + 55, yPosition); // No .toString() needed since value is now guaranteed to be a string
    yPosition += 8;
  });

  yPosition += 10;

  // Incident Details Section
  doc.setFillColor(...hexToRgb(colors.redOrange));
  doc.rect(margin, yPosition, 180, 10, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DETALLES DE LA INCIDENCIA", margin + 5, yPosition + 7);

  yPosition += 20;
  doc.setTextColor(0, 0, 0);

  const severityColors: { [key: string]: string } = {
    leve: colors.yellow,
    severo: colors.orange,
    grave: colors.redOrange,
    muy_grave: colors.deepPink,
  };

  // Severity Level with Circle
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(colors.deepPink));
  doc.text("Nivel de severidad:", margin, yPosition);
  const severityColor = severityColors[incident.nivel_severidad?.toLowerCase() || ""] || colors.deepPink;
  doc.setFillColor(...hexToRgb(severityColor));
  doc.circle(margin + 50, yPosition - 2, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(incident.nivel_severidad || "N/A", margin + 56, yPosition);
  yPosition += 10;

  // Motivo
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(colors.deepPink));
  doc.text("Motivo:", margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(incident.motivo || "N/A", margin + 20, yPosition);
  yPosition += 10;

  // Descripción
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...hexToRgb(colors.deepPink));
  doc.text("Descripción:", margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  const descLines = doc.splitTextToSize(incident.descripcion || "N/A", 170);
  doc.text(descLines, margin, yPosition + 5);
  yPosition += descLines.length * 7 + 10;

  // Signature Section
  if (yPosition > 250) doc.addPage();
  const text1 = "Incidencia registrada por:";
  const text1Width = doc.getTextWidth(text1);
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...hexToRgb(colors.deepPink));
  doc.text(text1, (pageWidth - text1Width) / 2, yPosition);

  const text2 = incident.nombre_personal || "N/A";
  const text2Width = doc.getTextWidth(text2);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(text2, (pageWidth - text2Width) / 2, yPosition + 7);

  const lineLength = 85;
  doc.setLineWidth(0.3);
  doc.line(
    (pageWidth - lineLength) / 2,
    yPosition + 20,
    (pageWidth + lineLength) / 2,
    yPosition + 20
  );

  const text3 = "Firma y sello de la Institución";
  const text3Width = doc.getTextWidth(text3);
  doc.setTextColor(...hexToRgb(colors.deepPink));
  doc.text(text3, (pageWidth - text3Width) / 2, yPosition + 28);

  // Footer
  const footerY = 297 - 20;
  doc.setFillColor(...hexToRgb(colors.yellow));
  doc.rect(0, footerY, pageWidth, 5, "F");
  doc.setFillColor(...hexToRgb(colors.orange));
  doc.rect(0, footerY + 5, pageWidth, 5, "F");
  doc.setFillColor(...hexToRgb(colors.redOrange));
  doc.rect(0, footerY + 10, pageWidth, 5, "F");
  doc.setFillColor(...hexToRgb(colors.deepPink));
  doc.rect(0, footerY + 15, pageWidth, 5, "F");

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
};

  const handleViewPDF = (incident: Incident) => {
    const url = generateIncidentPDF(incident);
    setSelectedIncident(incident);
    setPdfUrl(url);
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.nombre_estudiante.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.motivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverities.length === 0 ||
      selectedSeverities.includes(incident.nivel_severidad.toLowerCase());

    return matchesSearch && matchesSeverity;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.mainContainer}
    >
      <Navbar />
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
        {["LEVE", "SEVERO", "GRAVE"].map((severity) => (
          <button
            key={severity}
            className={`${styles.severityFilter} ${
              selectedSeverities.includes(severity.toLowerCase()) ? styles.active : ""
            }`}
            onClick={() => {
              const lowerSeverity = severity.toLowerCase();
              setSelectedSeverities((prev) =>
                prev.includes(lowerSeverity)
                  ? prev.filter((s) => s !== lowerSeverity)
                  : [...prev, lowerSeverity]
              );
            }}
          >
            {severity}
          </button>
        ))}
        <div className={styles.calendarContainer}></div>
      </div>

      <IncidentsTable incidents={filteredIncidents} onViewPDF={handleViewPDF} />

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