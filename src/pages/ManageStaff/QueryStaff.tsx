import React, { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./AddStaff.module.css";
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

const QueryStaff: React.FC = () => {
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

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFilters((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterStudents();
  };

  const filterStudents = () => {
    const filtered = students.filter((student) => {
      const matchesSearch = `${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno} ${student.curp} ${student.grado} ${student.grupo} ${student.anio_ingreso}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilters =
        (filters.grado.length === 0 || filters.grado.includes(student.grado)) &&
        (filters.grupo.length === 0 || filters.grupo.includes(student.grupo)) &&
        (filters.anio_ingreso.length === 0 ||
          filters.anio_ingreso.includes(student.anio_ingreso));

      return matchesSearch && matchesFilters;
    });

    setFilteredStudents(filtered);
  };

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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.filters}>
            <label>
              Grado:
              <select
                name="grado"
                multiple
                onChange={handleFilterChange}
                value={filters.grado}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                {/* Add more options as needed */}
              </select>
            </label>

            <label>
              Grupo:
              <select
                name="grupo"
                multiple
                onChange={handleFilterChange}
                value={filters.grupo}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                {/* Add more options as needed */}
              </select>
            </label>

            <label>
              Año de Ingreso:
              <select
                name="anio_ingreso"
                multiple
                onChange={handleFilterChange}
                value={filters.anio_ingreso}
              >
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                {/* Add more options as needed */}
              </select>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Buscar
          </button>
        </form>

        <div className={styles.tableContainer}>
          {filteredStudents.length > 0 ? (
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

export default QueryStaff;