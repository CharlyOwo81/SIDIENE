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

const ExportRecord = () => {
  const [filters, setFilters] = useState({ grade: "", group: "" });
  const [students, setStudents] = useState<
    Array<{
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
            setStudents(response.data || []);
            setSelectedStudents([]);
          } else {
            setAlert({
              message: response.message || "Error al cargar estudiantes",
              type: "error",
            });
            setStudents([]);
          }
        } catch (error) {
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
        return new Date(dateString).toLocaleDateString("es-MX");
      } catch {
        return "Sin fecha registrada";
      }
    };

    try {
      for (const [index, curp] of selectedStudents.entries()) {
        try {
          if (index > 0) {
            doc.addPage();
          }

          const response = await ExpedienteService.getByStudent(curp);
          console.log("Expediente response for", curp, ":", response);
          const expediente = response.data?.[0];
          const student = students.find((s) => s.curp === curp);

          if (!student || !expediente) {
            console.warn(`Estudiante ${curp} no encontrado`);
            continue;
          }

          if (
            !expediente.incidencias ||
            !Array.isArray(expediente.incidencias)
          ) {
            console.error("Estructura de incidencias inválida:", expediente);
            continue;
          }

          let yPosition = 15;
          const colors = {
            primary: "#2c3e50",
            secondary: "#3498db",
            accent: "#e74c3c",
          };

          // Header
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(colors.primary);
          doc.text(
            `Expediente de ${student.nombres} ${student.apellido_paterno} ${
              student.apellido_materno || ""
            }`,
            15,
            yPosition
          );
          yPosition += 10;

          // Incidents
          for (const [idx, incidencia] of expediente.incidencias.entries()) {
            // Incident Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(colors.secondary);
            doc.text(
              `Incidencia #${idx + 1}: ${incidencia.motivo}`,
              15,
              yPosition
            );
            yPosition += 6;

            // Incident Details
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(colors.primary);
            doc.text(`Severidad: ${incidencia.nivel_severidad}`, 15, yPosition);
            yPosition += 5;
            doc.text(`Fecha: ${safeDate(incidencia.fecha)}`, 15, yPosition);
            yPosition += 5;
            doc.text(
              `Descripción: ${incidencia.descripcion || "Sin descripción"}`,
              15,
              yPosition
            );
            yPosition += 8;

            // Agreements
            console.log(
              `Acuerdos for incidencia ${incidencia.id_incidencia}:`,
              incidencia.acuerdos
            );
            if (incidencia.acuerdos?.length > 0) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.setTextColor(colors.accent);
              doc.text("Acuerdos establecidos:", 15, yPosition);
              yPosition += 6;

              const agreementData = incidencia.acuerdos.map(
                (acuerdo: Acuerdo) => {
                  console.log("Processing acuerdo:", acuerdo);
                  return [
                    safeDate(acuerdo.fecha_creacion),
                    acuerdo.descripcion || "Sin descripción",
                    acuerdo.estatus || "Sin estatus",
                  ];
                }
              );

              (doc as any).autoTable({
                startY: yPosition,
                head: [["Fecha", "Descripción", "Estatus"]],
                body: agreementData,
                theme: "grid",
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: colors.secondary, textColor: 255 },
                columnStyles: {
                  0: { cellWidth: 30 },
                  1: { cellWidth: 100 },
                  2: { cellWidth: 40 },
                },
              });

              yPosition = (doc as any).lastAutoTable.finalY + 10;
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.setTextColor(colors.primary);
              doc.text("No hay acuerdos establecidos.", 15, yPosition);
              yPosition += 8;
            }
          }
        } catch (error) {
          console.error(`Error procesando estudiante ${curp}:`, error);
          continue;
        }
      }

      doc.save(`expedientes_${new Date().toISOString().slice(0, 10)}.pdf`);
      setAlert({ message: "PDF generado exitosamente", type: "success" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setAlert({ message: "Error al generar el PDF", type: "error" });
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
      className={styles.mainContainer}>
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
          className={styles.alertContainer}>
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

        {!loading &&
          students.length === 0 &&
          filters.grade &&
          filters.group && (
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
                        setSelectedStudents([
                          ...selectedStudents,
                          student.curp,
                        ]);
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
          disabled={selectedStudents.length === 0 || loading}>
          {loading ? "Generando PDF..." : "Exportar Selección"}
        </button>
      </div>
    </motion.section>
  );
};

export default ExportRecord;
