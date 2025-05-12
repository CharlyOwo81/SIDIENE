import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ExpedienteService,
  Incidencia,
  Acuerdo,
} from "../../../backend/services/expedienteService";
import SelectField from "../../assets/components/SelectField/SelectField";
import Navbar from "../../assets/components/Navbar/Navbar";
import Alert from "../../assets/components/Alert/Alert";
import styles from "./ManageExpedientes.module.css";
import tecnica56Logo from "../../../../public/tecnica56logo.png";
import sonoraLogo from "../../../../public/sonoraLogo.png";

const ExportRecord = () => {
  const [filters, setFilters] = useState({ grade: "", group: "" });
  const [students, setStudents] = useState<
    Array<{
      grupo: string;
      grado: any;
      curp: string;
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
    }>
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.grade && filters.group) {
        setLoading(true);
        setAlert(null);
        try {
          const response = await ExpedienteService.getStudentsWithExpediente(
            filters.grade,
            filters.group
          );
          console.log("Students response:", response);
          if (response.success) {
            setStudents(
              (response.data || []).map((student) => ({
                ...student,
                grupo: student.grupo || "",
                grado: student.grado || "",
              }))
            );
            setSelectedStudents([]);
          } else {
            setAlert({
              message: response.message || "Error al cargar estudiantes",
              type: "error",
            });
            setStudents([]);
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setAlert({
            message: "Error de conexión al cargar estudiantes",
            type: "error",
          });
          setStudents([]);
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setSelectedStudents([]);
      }
    };
    fetchStudents();
  }, [filters.grade, filters.group]);

  const generatePDF = async () => {
    setLoading(true);
    setAlert(null);

    if (selectedStudents.length === 0) {
      setAlert({
        message: "Selecciona al menos un estudiante",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const safeDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Sin fecha registrada" : date.toLocaleDateString("es-MX");
      } catch {
        return "Sin fecha registrada";
      }
    };

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

    const severityColors: { [key: string]: string } = {
      leve: colors.yellow,
      severo: colors.orange,
      grave: colors.deepPink,
    };

    const addHeader = (yPosition: number) => {
      const margin = 15;
      const pageWidth = 210;
      const logoLeftWidth = 28;
      const logoRightWidth = 28;

      try {
        doc.addImage(tecnica56Logo, "PNG", margin, yPosition, logoLeftWidth, 18);
        const logoRightX = pageWidth - margin - logoRightWidth;
        doc.addImage(sonoraLogo, "PNG", logoRightX, yPosition, logoRightWidth, 14);
      } catch (error) {
        console.error("Error loading logos:", error);
        throw new Error("Failed to load logo images");
      }

      const textStartX = margin + logoLeftWidth + 5;
      const textAvailableWidth = pageWidth - (2 * margin) - logoLeftWidth - logoRightWidth - 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const titleText = "ESCUELA SECUNDARIA TÉCNICA NO. 56";
      const titleWidth = doc.getTextWidth(titleText);
      const titleX = textStartX + (textAvailableWidth - titleWidth) / 2;
      doc.text(titleText, titleX, yPosition + 10);

      doc.setFontSize(14);
      const schoolName = "'JOSÉ LUIS OSUNA VILLA'";
      const schoolWidth = doc.getTextWidth(schoolName);
      const schoolX = textStartX + (textAvailableWidth - schoolWidth) / 2;
      doc.text(schoolName, schoolX, yPosition + 18);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const subtitleText = "Sistema de Digitalización de Expedientes e Incidencias para la Nueva Escuela";
      const subtitleLines = doc.splitTextToSize(subtitleText, textAvailableWidth);
      const subtitleY = yPosition + 26;
      subtitleLines.forEach((line, index) => {
        const lineWidth = doc.getTextWidth(line);
        const lineX = textStartX + (textAvailableWidth - lineWidth) / 2;
        doc.text(line, lineX, subtitleY + index * 7);
      });

      const dateY = subtitleY + subtitleLines.length * 7 + 6;
      const dateText = `PDF generado: ${new Date().toLocaleDateString("es-MX")}`;
      const dateWidth = doc.getTextWidth(dateText);
      const dateX = textStartX + (textAvailableWidth - dateWidth) / 2;
      doc.text(dateText, dateX, dateY);

      return dateY + 6 - yPosition; // Return header height
    };

    const addFooter = () => {
      const footerY = 297 - 20;
      doc.setFillColor(...hexToRgb(colors.yellow));
      doc.rect(0, footerY, 210, 5, "F");
      doc.setFillColor(...hexToRgb(colors.orange));
      doc.rect(0, footerY + 5, 210, 5, "F");
      doc.setFillColor(...hexToRgb(colors.redOrange));
      doc.rect(0, footerY + 10, 210, 5, "F");
      doc.setFillColor(...hexToRgb(colors.deepPink));
      doc.rect(0, footerY + 15, 210, 5, "F");
    };

    try {
      for (const [studentIndex, curp] of selectedStudents.entries()) {
        try {
          if (studentIndex > 0) {
            doc.addPage();
          }

          const response = await ExpedienteService.getByStudent(curp);
          console.log(`Expediente response for ${curp}:`, JSON.stringify(response, null, 2));
          const expediente = response.data?.[0];
          const student = students.find((s) => s.curp === curp);

          if (!student || !expediente) {
            console.warn(`Estudiante ${curp} no encontrado o sin expediente`);
            setAlert({
              message: `No se encontró expediente para ${curp}`,
              type: "warning",
            });
            continue;
          }

          if (!expediente.incidencias || !Array.isArray(expediente.incidencias)) {
            console.error("Estructura de incidencias inválida:", expediente);
            setAlert({
              message: `Estructura de incidencias inválida para ${curp}`,
              type: "error",
            });
            continue;
          }

          let yPosition = 15;
          const margin = 15;
          const pageWidth = 210;

          // Student Section (once per student)
          const headerHeight = addHeader(yPosition);
          yPosition += headerHeight + 10;

          doc.setFillColor(...hexToRgb(colors.orange));
          doc.rect(margin, yPosition, 180, 10, "F");
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("DATOS DEL ESTUDIANTE", margin + 5, yPosition + 7);

          yPosition += 20;
          doc.setTextColor(0, 0, 0);

          const studentName = `${student.nombres} ${student.apellido_paterno} ${student.apellido_materno || ""}`.trim();
          console.log(`Student data for ${curp}:`, { grado: student.grado, grupo: student.grupo });
          const gradeGroup = student.grado && student.grupo ? `${student.grado}° ${student.grupo}` : "N/A";
          const studentData = [
            ["Nombre:", studentName || "N/A"],
            ["CURP:", curp || "N/A"],
            ["Grado y grupo:", gradeGroup],
          ];

          studentData.forEach(([label, value]) => {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text(label, margin, yPosition);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(value, margin + 55, yPosition);
            yPosition += 8;
          });

          yPosition += 10;

          // Incidents
          for (const [idx, incidencia] of expediente.incidencias.entries()) {
            if (yPosition > 230) {
              doc.addPage();
              yPosition = 15;
              addHeader(yPosition);
              yPosition += headerHeight + 10;
            }

            // Incident Section Header
            doc.setFillColor(...hexToRgb(colors.redOrange));
            doc.rect(margin, yPosition, 180, 10, "F");
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text("DETALLES DE LA INCIDENCIA", margin + 5, yPosition + 7);

            yPosition += 20;
            doc.setTextColor(0, 0, 0);

            // Incident Details
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text("Fecha:", margin, yPosition);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(safeDate(incidencia.fecha), margin + 55, yPosition);
            yPosition += 10;

            doc.setFont("helvetica", "bold");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text("Nivel de severidad:", margin, yPosition);
            doc.setFillColor(...hexToRgb(severityColors[incidencia.nivel_severidad?.toLowerCase()] || colors.deepPink));
            doc.circle(margin + 50, yPosition - 2, 3, "F");
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(incidencia.nivel_severidad || "Sin severidad", margin + 60, yPosition);
            yPosition += 10;

            doc.setFont("helvetica", "bold");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text("Motivo:", margin, yPosition);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const motivoLines = doc.splitTextToSize(incidencia.motivo || "Sin motivo", 170);
            doc.text(motivoLines, margin + 20, yPosition);
            yPosition += Math.max(motivoLines.length * 7, 10);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text("Descripción:", margin, yPosition);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const description = incidencia.descripcion || "Sin descripción";
            const descriptionLines = doc.splitTextToSize(description, 170);
            doc.text(descriptionLines, margin, yPosition + 5);
            yPosition += descriptionLines.length * 7 + 10;

            // Agreements
            console.log(`Acuerdos for incidencia ${incidencia.id_incidencia}:`, incidencia.acuerdos);
            if (incidencia.acuerdos?.length > 0) {
              if (yPosition > 230) {
                doc.addPage();
                yPosition = 15;
                addHeader(yPosition);
                yPosition += headerHeight + 10;
              }

              doc.setFont("helvetica", "bold");
              doc.setTextColor(...hexToRgb(colors.deepPink));
              doc.text("Acuerdos establecidos:", margin, yPosition);
              yPosition += 8;

              for (const acuerdo of incidencia.acuerdos) {
                if (yPosition > 230) {
                  doc.addPage();
                  yPosition = 15;
                  addHeader(yPosition);
                  yPosition += headerHeight + 10;
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(...hexToRgb(colors.deepPink));
                  doc.text("Acuerdos establecidos:", margin, yPosition);
                  yPosition += 8;
                }

                doc.setFont("helvetica", "bold");
                doc.setTextColor(...hexToRgb(colors.deepPink));
                doc.text("Estatus:", margin + 10, yPosition);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
                doc.text(acuerdo.estatus || "Sin estatus", margin + 30, yPosition);
                yPosition += 8;

                doc.setFont("helvetica", "bold");
                doc.setTextColor(...hexToRgb(colors.deepPink));
                doc.text("Descripción:", margin + 10, yPosition);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
                const acuerdoDesc = acuerdo.descripcion || "Sin descripción";
                const acuerdoLines = doc.splitTextToSize(acuerdoDesc, 160);
                doc.text(acuerdoLines, margin + 30, yPosition);
                yPosition += acuerdoLines.length * 7;

                doc.setFont("helvetica", "bold");
                doc.setTextColor(...hexToRgb(colors.deepPink));
                doc.text("Creado el:", margin + 10, yPosition);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
                doc.text(safeDate(acuerdo.fecha_creacion), margin + 30, yPosition);
                yPosition += 10;
              }
            } else {
              if (yPosition > 230) {
                doc.addPage();
                yPosition = 15;
                addHeader(yPosition);
                yPosition += headerHeight + 10;
              }

              doc.setFont("helvetica", "bold");
              doc.setTextColor(...hexToRgb(colors.deepPink));
              doc.text("Acuerdos establecidos:", margin, yPosition);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
              doc.text("No hay acuerdos establecidos.", margin + 10, yPosition + 7);
              yPosition += 14;
            }

            // Signature Section
            if (yPosition > 230) {
              doc.addPage();
              yPosition = 15;
              addHeader(yPosition);
              yPosition += headerHeight + 10;
            }

            const text1 = "Incidencia registrada por:";
            const text1Width = doc.getTextWidth(text1);
            doc.setFontSize(12);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(...hexToRgb(colors.deepPink));
            doc.text(text1, (pageWidth - text1Width) / 2, yPosition);

            const text2 = "N/A"; // No nombre_personal in expediente.incidencias
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

            yPosition += 35;

            // Add footer
            addFooter();
          }

          if (expediente.incidencias.length === 0) {
            console.warn(`No hay incidencias para el estudiante ${curp}`);
            setAlert({
              message: `No hay incidencias para ${studentName}`,
              type: "warning",
            });
            continue;
          }
        } catch (error) {
          console.error(`Error procesando estudiante ${curp}:`, error);
          setAlert({
            message: `Error al procesar el expediente de ${curp}: ${
              error instanceof Error ? error.message : "Error desconocido"
            }`,
            type: "error",
          });
          continue;
        }
      }

      doc.save(`expedientes_${new Date().toISOString().slice(0, 10)}.pdf`);
      setAlert({ message: "PDF generado exitosamente", type: "success" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setAlert({
        message: `Error al generar el PDF: ${error instanceof Error ? error.message : "Error desconocido"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = [
    { value: "", label: "Seleccionar grado" },
    { value: "1", label: "1°" },
    { value: "2", label: "2°" },
    { value: "3", label: "3°" },
  ];

  const groupOptions = [
    { value: "", label: "Seleccionar grupo" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={styles.mainContainer}
    >
      <Navbar
        title="Exportar Expedientes"
        buttons={[
          { label: "Exportar", icon: "📤", path: "/ExportRecord" },
          { label: "Consultar", icon: "🔍", path: "/ViewRecord" },
          { label: "Regresar", icon: "↩️", path: "/" },
        ]}
      />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.alertContainer}
        >
          <Alert {...alert} onClose={() => setAlert(null)} />
        </motion.div>
      )}

      <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>Exportar Expedientes a PDF</h1>

        <div className={styles.filterSection}>
          <SelectField
            value={filters.grade}
            onChange={(e) =>
              setFilters({ ...filters, grade: e.target.value, group: "" })
            }
            options={gradeOptions}
            required
          />
          <SelectField
            value={filters.group}
            onChange={(e) => setFilters({ ...filters, group: e.target.value })}
            options={groupOptions}
            disabled={!filters.grade}
            required
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner}></span> Cargando estudiantes...
          </div>
        )}

        {!loading && students.length === 0 && filters.grade && filters.group && (
          <div className={styles.emptyState}>
            No hay estudiantes en este grado y grupo.
          </div>
        )}

        {!loading && students.length > 0 && (
          <div className={styles.studentList}>
            {students.map((student) => (
              <div key={student.curp} className={styles.studentItem}>
                <label className={styles.studentLabel}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.curp)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.curp]);
                      } else {
                        setSelectedStudents(
                          selectedStudents.filter((c) => c !== student.curp)
                        );
                      }
                    }}
                    className={styles.studentCheckbox}
                  />
                  <span>{`${student.nombres} ${student.apellido_paterno} ${
                    student.apellido_materno || ""
                  }`}</span>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.exportButton}
          onClick={generatePDF}
          disabled={selectedStudents.length === 0 || loading}
        >
          {loading ? "Generando PDF..." : "Exportar Selección"}
        </button>
      </div>
    </motion.section>
  );
};

export default ExportRecord;