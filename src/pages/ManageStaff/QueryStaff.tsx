import React, { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./ManageStudents.module.css";
import InputField from "../../assets/components/InputField/InputField";
import Button from "../../assets/components/Button/Button";
import Navbar from "../../assets/components/Navbar/StudentsNavbar";
import FormSection from "../../assets/components/FormSection/FormSection";
import Alert from "../../assets/components/Alert/Alert";
import GoBackButton from "../../assets/components/Button/GoBackButton";

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  rol: string;
}

const QueryStaff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState({
    curp: "",
    telefono: "",
    rol: "",
  });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar todos los miembros del personal al montar el componente
  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/staff");
        setStaff(response.data);
        setFilteredStaff(response.data); // Inicialmente, mostrar todos los registros
        setAlert({
          message: "Datos del personal cargados correctamente.",
          type: "success",
        });
      } catch (error: any) {
        setAlert({
          message: error.message || "Error al cargar los datos del personal.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    const filtered = staff.filter((member) => {
      const matchesCurp = searchQuery.curp
        ? member.curp.toLowerCase().includes(searchQuery.curp.toLowerCase())
        : true;
      const matchesTelefono = searchQuery.telefono
        ? member.telefono.includes(searchQuery.telefono)
        : true;
      const matchesRol = searchQuery.rol
        ? member.rol.toLowerCase().includes(searchQuery.rol.toLowerCase())
        : true;

      return matchesCurp && matchesTelefono && matchesRol;
    });

    setFilteredStaff(filtered);
  };

  // Ejecutar la búsqueda cuando cambien los filtros
  useEffect(() => {
    applyFilters();
  }, [searchQuery]);

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
        <h2 className={styles.formTitle}>Consultar Personal</h2>
        <form className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Filtros de Búsqueda</legend>

            <FormSection title="Filtrar por CURP, Teléfono o Rol">
              <InputField
                type="text"
                name="curp"
                placeholder="Buscar por CURP"
                value={searchQuery.curp}
                onChange={handleFilterChange}
              />
              <InputField
                type="text"
                name="telefono"
                placeholder="Buscar por Teléfono"
                value={searchQuery.telefono}
                onChange={handleFilterChange}
              />
              <InputField
                type="text"
                name="rol"
                placeholder="Buscar por Rol"
                value={searchQuery.rol}
                onChange={handleFilterChange}
              />
            </FormSection>
          </fieldset>
        </form>

        <div className={styles.tableContainer}>
          {filteredStaff.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>CURP</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member, index) => (
                  <motion.tr
                    key={member.curp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <td>{member.curp}</td>
                    <td>{`${member.nombres} ${member.apellidoPaterno} ${member.apellidoMaterno}`}</td>
                    <td>{member.telefono}</td>
                    <td>{member.rol}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noResults}>
              No se encontraron resultados con los filtros especificados.
            </p>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default QueryStaff;