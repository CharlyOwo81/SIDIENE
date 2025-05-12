import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SelectField from "../../assets/components/SelectField/SelectField";
import Navbar from "../../assets/components/Navbar/Navbar";
import Alert from "../../assets/components/Alert/Alert";
import styles from "./ManageExpedientes.module.css";
import tecnica56Logo from "../../../../public/tecnica56logo.png";
import sonoraLogo from "../../../../public/sonoraLogo.png";
import generatePDF from "../../utils/pdfGenerator";
import { ExpedienteService } from "../../../backend/services/expedienteService";
import { gradoOptions, grupoOptions } from "../../../backend/constants/filtersOptions";
import GoBackButton from "../../assets/components/Button/GoBackButton";

const ExportRecord = () => {
  const [filters, setFilters] = useState({ grade: "", group: "" });
  const [students, setStudents] = useState<
    Array<{
      curp: string;
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
      grupo: string;
      grado: string;
    }>
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
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
          if (response.success) {
            setStudents(
              (response.data || []).map((student) => ({
                curp: student.curp || "N/A",
                nombres: student.nombres || "N/A",
                apellido_paterno: student.apellido_paterno || "N/A",
                apellido_materno: student.apellido_materno || "N/A",
                grupo: student.grupo || filters.group || "N/A",
                grado: student.grado || filters.grade || "N/A",
              }))
            );
            setSelectedStudent("");
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
        setSelectedStudent("");
      }
    };
    fetchStudents();
  }, [filters.grade, filters.group]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={styles.mainContainer}
    >
      <Navbar
        title="Gestionar Expedientes"
        buttons={[
          { label: "Registrar", icon: "➕", path: "/CreateRecord" },
          { label: "Consultar", icon: "🔍", path: "/ViewRecord" },
          { label: "Actualizar", icon: "✏️", path: "/UpdateRecord" },
          { label: "Exportar", icon: "📥", path: "/ExportRecord" },
        ]}
        className="tutor-navbar"
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
          <div>
            <label className={styles.filterLabel}>Grado</label>
            <SelectField
              value={filters.grade}
              onChange={(e) =>
                setFilters({ ...filters, grade: e.target.value, group: "" })
              }
              options={gradoOptions}
              required
            />
          </div>
          <div>
            <label className={styles.filterLabel}>Grupo</label>
            <SelectField
              value={filters.group}
              onChange={(e) => setFilters({ ...filters, group: e.target.value })}
              options={grupoOptions}
              disabled={!filters.grade}
              required
            />
          </div>
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
                    type="radio"
                    name="studentSelection"
                    checked={selectedStudent === student.curp}
                    onChange={() => setSelectedStudent(student.curp)}
                    className={styles.studentRadio}
                  />
                  <span>{`${student.nombres} ${student.apellido_paterno} ${
                    student.apellido_materno || ""
                  }`}</span>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className={styles.formActions}>
          <GoBackButton/>
          <button
            className={styles.exportButton}
            onClick={() =>
              generatePDF(
                [selectedStudent], // Pasamos como array para mantener compatibilidad
                students,
                setLoading,
                setAlert,
                tecnica56Logo,
                sonoraLogo
              )
            }
            disabled={!selectedStudent || loading}
          >
            {loading ? "Generando PDF..." : "Exportar Selección"}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ExportRecord;