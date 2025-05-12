import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../assets/components/Alert/Alert";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import styles from "./ManageTutors.module.css";
import navbarStyles from "../../assets/components/Navbar/Navbar.module.css";
import Navbar from "../../assets/components/Navbar/TutorNavbar";
import GoBackButton from "../../assets/components/Button/GoBackButton";

const ExportTutors: React.FC = () => {
  const [filters, setFilters] = useState({
    grado: "",
    grupo: "",
    studentCurp: "",
  });
  const [students, setStudents] = useState<
    { curp: string; nombre_completo: string }[]
  >([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch students when grado and grupo change
  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.grado && filters.grupo) {
        try {
          setIsLoadingStudents(true);
          const response = await axios.get(
            "http://localhost:3307/api/students",
            {
              params: { grado: filters.grado, grupo: filters.grupo },
            }
          );
          const studentData = response.data.data.map((student: any) => ({
            curp: student.curp,
            nombre_completo: `${student.nombres} ${student.apellidoPaterno} ${
              student.apellidoMaterno || ""
            }`.trim(),
          }));
          setStudents(studentData);
          setFilters((prev) => ({ ...prev, studentCurp: "" }));
        } catch (error: any) {
          console.error('Fetch students error:', error.response || error);
          setAlert({ message: "Error al cargar estudiantes", type: "error" });
        } finally {
          setIsLoadingStudents(false);
        }
      } else {
        setStudents([]);
        setFilters((prev) => ({ ...prev, studentCurp: "" }));
      }
    };
    fetchStudents();
  }, [filters.grado, filters.grupo]);

  const handleExport = async () => {
    if (!filters.studentCurp) {
      setAlert({ message: "Selecciona un estudiante", type: "error" });
      return;
    }
  
    try {
      setIsExporting(true);
      const response = await axios.get(
        "http://localhost:3307/api/tutor/export",
        {
          params: { studentCurp: filters.studentCurp },
          responseType: "blob",
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tutores_${filters.studentCurp}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      setAlert({ message: "PDF generado exitosamente", type: "success" });
    } catch (error: any) {
      console.error('Export error:', error.response || error);
      setAlert({ message: "Error generando PDF", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Navbar className={navbarStyles.navbar} />
      <div className={styles.formContainer} aria-busy={isLoadingStudents}>
        {isLoadingStudents && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.loadingOverlay}
          >
            <div className={styles.loadingSpinner}></div>
          </motion.div>
        )}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.formTitle}
        >
          Exportar Tutores a PDF
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.filterSection}
        >
          <div className={styles.filterGroup}>
            <label htmlFor="grado" className={styles.label}>
              Grado
            </label>
            <SelectField
              id="grado"
              name="grado"
              value={filters.grado}
              onChange={(e) => setFilters({ ...filters, grado: e.target.value })}
              options={[
                { value: "", label: "Selecciona grado" },
                ...Array.from({ length: 3 }, (_, i) => ({
                  value: `${i + 1}`,
                  label: `${i + 1}°`,
                })),
              ]}
              aria-label="Seleccionar grado"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="grupo" className={styles.label}>
              Grupo
            </label>
            <SelectField
              id="grupo"
              name="grupo"
              value={filters.grupo}
              onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
              options={[
                { value: "", label: "Selecciona grupo" },
                ..."ABCDEF"
                  .split("")
                  .map((letter) => ({ value: letter, label: letter })),
              ]}
              aria-label="Seleccionar grupo"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="studentCurp" className={styles.label}>
              Estudiante
            </label>
            <SelectField
              id="studentCurp"
              name="studentCurp"
              value={filters.studentCurp}
              onChange={(e) =>
                setFilters({ ...filters, studentCurp: e.target.value })
              }
              options={[
                {
                  value: "",
                  label: isLoadingStudents
                    ? "Cargando..."
                    : students.length === 0
                    ? "No hay estudiantes"
                    : "Selecciona estudiante",
                },
                ...students.map((student) => ({
                  value: student.curp,
                  label: student.nombre_completo,
                })),
              ]}
              disabled={isLoadingStudents || !filters.grado || !filters.grupo}
              aria-label="Seleccionar estudiante"
            />
          </div>
        </motion.div>

        {students.length === 0 && filters.grado && filters.grupo && !isLoadingStudents && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.emptyState}
          >
            <span>No se encontraron estudiantes</span>
            <p>Intenta con otro grado o grupo.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.formActions}
        >
          <GoBackButton/>
          <Button
            onClick={handleExport}
            disabled={isExporting || !filters.studentCurp}
            type="button"
          >
            {isExporting ? (
              <>
                <span className={styles.spinner}></span> Generando...
              </>
            ) : (
              "Generar PDF"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExportTutors;