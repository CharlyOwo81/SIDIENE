import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../assets/components/Alert/Alert";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import styles from "./ManageTutors.module.css";
import Navbar from "../../assets/components/Navbar/TutorNavbar";

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
      className={styles.container}
    >
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <Navbar />
      <h2 className={styles.formTitle}>Exportar Tutores a PDF</h2>

      <div className={styles.filterSection}>
        <SelectField
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
        />

        <SelectField
          name="grupo"
          value={filters.grupo}
          onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
          options={[
            { value: "", label: "Selecciona grupo" },
            ..."ABCDEF"
              .split("")
              .map((letter) => ({ value: letter, label: letter })),
          ]}
        />

        <SelectField
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
                : "Selecciona estudiante",
            },
            ...students.map((student) => ({
              value: student.curp,
              label: student.nombre_completo,
            })),
          ]}
          disabled={isLoadingStudents || !filters.grado || !filters.grupo}
        />
      </div>

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
  );
};

export default ExportTutors;