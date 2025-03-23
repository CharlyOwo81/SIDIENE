import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./ManageStudents.module.css";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import FormSection from "../../assets/components/FormSection/FormSection";
import Alert from "../../assets/components/Alert/Alert";
import GoBackButton from "../../assets/components/Button/GoBackButton";

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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/queryStudents", {
        params: {
          search: searchQuery,
          ...filters,
        },
      });

      setStudents(response.data.students || []);
      setAlert({
        message: response.data.message || "Consulta realizada con éxito.",
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message ||
          (error.request
            ? "Sin respuesta del servidor."
            : "Error al procesar la consulta."),
        type: "error",
      });
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno} ${student.curp} ${student.grado} ${student.grupo} ${student.anio_ingreso}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        <form onSubmit={handleQuery} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Búsqueda y Filtros</legend>

            <FormSection title="Búsqueda General">
              <InputField
                type="text"
                name="search"
                placeholder="Buscar por nombre, CURP, grado, etc."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </FormSection>

            <FormSection title="Filtros Específicos">
              <InputField
                type="text"
                name="grado"
                placeholder="Grado"
                value={filters.grado}
                onChange={handleFilterChange}
              />
              <InputField
                type="text"
                name="grupo"
                placeholder="Grupo"
                value={filters.grupo}
                onChange={handleFilterChange}
              />
              <InputField
                type="text"
                name="anio_ingreso"
                placeholder="Año de Ingreso"
                value={filters.anio_ingreso}
                onChange={handleFilterChange}
              />
            </FormSection>

            <div className={styles.buttonContainer}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span> Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
              <GoBackButton />
            </div>
          </fieldset>
        </form>

        <div className={styles.tableContainer}>
          {filteredStudents.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Grado y Grupo</th>
                  <th>CURP</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.curp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <td>{`${student.nombres} ${student.apellidoPaterno} ${student.apellidoMaterno}`}</td>
                    <td>{`${student.grado} - ${student.grupo}`}</td>
                    <td>{student.curp}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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