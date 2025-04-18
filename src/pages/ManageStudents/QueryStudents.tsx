import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import styles from "./ManageStudents.module.css";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import Alert from "../../assets/components/Alert/Alert";
import { getAllStudents } from "../../services/studentsApi";
import StudentQueryForm from "./QueryStudentForm"; // Import the new form
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
  const [filters, setFilters] = useState<{
    grado: string[];
    grupo: string[];
    anio_ingreso: string[];
  }>({
    grado: [],
    grupo: [],
    anio_ingreso: [],
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [alert, setAlert] = useState<null | {
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFilters((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await getAllStudents(searchQuery, filters);

      // Check for warning in response data
      if (response.data.warning) {
        setAlert({
          message: response.data.warning,
          type: "warning",
        });
        setStudents([]);
        setFilteredStudents([]);
      } else {
        // Access data directly from response.data.data
        const studentsData = response.data.data || [];
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setAlert({
          message:
            studentsData.length > 0
              ? `Encontrados ${studentsData.length} estudiantes`
              : "No se encontraron resultados",
          type: "success",
        });
      }
    } catch (error: any) {
      setAlert({
        message: error.message || "Error al cargar estudiantes",
        type: "error",
      });
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        `${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno} ${student.curp} ${student.grado} ${student.grupo} ${student.anio_ingreso}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesFilters =
        (filters.grado.length === 0 || filters.grado.includes(student.grado)) &&
        (filters.grupo.length === 0 || filters.grupo.includes(student.grupo));

      return matchesSearch && matchesFilters;
    });

    setFilteredStudents(filtered);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.mainContainer}>
      <Navbar />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer}>
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            autoDismiss={true}
            dismissTime={5000}
          />
        </motion.div>
      )}

      <StudentQueryForm
        searchQuery={searchQuery}
        filters={filters}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleSubmit={handleSubmit}
      />

      <div className={styles.tableContainer}>
        {isLoading ? (
          <p>Cargando estudiantes.</p>
        ) : filteredStudents.length > 0 ? (
          <StudentTable students={filteredStudents} />
        ) : (
          <p className={styles.noResults}>
            {filters.grado.length === 0 &&
            filters.grupo.length === 0 &&
            !searchQuery
              ? "Utilice los filtros para buscar estudiantes"
              : "No se encontraron estudiantes con los criterios especificados"}
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default QueryStudents;
