import React, { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ManageStudents.module.css";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import Alert from "../../assets/components/Alert/Alert";
import { getAllStudents } from "../../services/studentsApi";
import SearchAndFilters from "../../assets/components/SearchAndFilters/SearchAndFilters";
import StudentTable from "../../assets/components/Table/StudentTable";

interface Student {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
}

const QueryStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    grado: "",
    grupo: "",
    anio_ingreso: "",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar todos los estudiantes al montar el componente
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await getAllStudents();
        setStudents(response.data);
        setAlert({
          message: "Estudiantes cargados correctamente.",
          type: "success",
        });
      } catch (error: any) {
        setAlert({
          message: error.message || "Error al cargar los estudiantes.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtrar estudiantes en el frontend
  const filteredStudents = students.filter((student) => {
    // Verificar si al menos un filtro tiene un valor
    const isAnyFilterApplied =
      filters.grado.trim() !== "" ||
      filters.grupo.trim() !== "" ||
      filters.anio_ingreso.trim() !== "";

    // Si no hay filtros aplicados, no mostrar ningún estudiante
    if (!isAnyFilterApplied) {
      return false;
    }

    // Aplicar la búsqueda y los filtros
    const matchesSearch = `${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno} ${student.curp} ${student.grado} ${student.grupo} ${student.anio_ingreso}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.grado || student.grado === filters.grado) &&
      (!filters.grupo || student.grupo === filters.grupo) &&
      (!filters.anio_ingreso || student.anio_ingreso === filters.anio_ingreso);

    return matchesSearch && matchesFilters;
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.mainContainer}
    >
      <Navbar />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer}
        >
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className={styles.container}
      >
        <h2 className={styles.formTitle}>Consultar Estudiantes</h2>

        <SearchAndFilters
          searchQuery={searchQuery}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        <div className={styles.tableContainer}>
          {filters.grado.trim() === "" &&
          filters.grupo.trim() === "" &&
          filters.anio_ingreso.trim() === "" ? (
            <p className={styles.noResults}>
              Por favor, aplica al menos un filtro para ver los resultados.
            </p>
          ) : filteredStudents.length > 0 ? (
            <StudentTable students={filteredStudents} />
          ) : (
            <p className={styles.noResults}>
              No se encontraron estudiantes con los criterios especificados.
            </p>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default QueryStudents;