import React, { useState, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./AddStaff.module.css";
import Navbar from "../../assets/components/Navbar/StaffNavbar";
import Alert from "../../assets/components/Alert/Alert";
import { getAllStaff } from "../../services/staffApi";
import StaffTable from "../../assets/components/Table/StaffTable";

interface Staff {
  id: string;
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
  telefono: string;
  estatus: string;
}

const QueryStaff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    rol: string[];
    estatus: string[];
  }>({
    rol: [],
    estatus: [],
  });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Cargar todo el personal al montar el componente
  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const response = await getAllStaff({ searchQuery: "", filters: {} });
        if (response.success) {
          setStaff(response.data);
          setFilteredStaff(response.data);
          setAlert({
            message: "Personal cargado correctamente.",
            type: "success",
          });
        } else {
          setAlert({
            message: response.message || "Error al cargar el personal.",
            type: "error",
          });
        }
      } catch (error: any) {
        setAlert({
          message: error.message || "Error al cargar el personal.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validar que no sea solo espacios
    if (value.trim() === '' && value !== '') {
      setLocalError("La búsqueda no puede contener solo espacios");
    } else {
      setLocalError(null);
    }
    setSearchQuery(value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFilters((prev) => ({ ...prev, [name]: selectedOptions }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar búsqueda vacía
    if (searchQuery.trim() === '' && 
        filters.rol.length === 0 && 
        filters.estatus.length === 0) {
      setLocalError("Debe ingresar un término de búsqueda o seleccionar al menos un filtro");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getAllStaff({
        searchQuery: searchQuery.trim(),
        filters
      });

      if (response.success) {
        setFilteredStaff(response.data);
        setAlert({
          message: `Se encontraron ${response.data.length} resultados.`,
          type: "success",
        });
      } else {
        setAlert({
          message: response.message || "Error en la búsqueda.",
          type: "error",
        });
      }
    } catch (error: any) {
      setAlert({
        message: error.message || "Error al realizar la búsqueda.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
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
        <h2 className={styles.formTitle}>Consultar Personal</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {localError && (
            <div className={styles.errorMessage}>
              {localError}
            </div>
          )}

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar personal..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={localError ? styles.inputError : ''}
            />
          </div>

          <div className={styles.filters}>
            <label>
              Rol:
              <select
                name="rol"
                multiple
                onChange={handleFilterChange}
                value={filters.rol}
              >
                <option value="DIRECTIVO">Directivo</option>
                <option value="DOCENTE">Docente</option>
                <option value="PREFECTO">Prefecto</option>
                <option value="TRABAJADOR_SOCIAL">Trabajador Social</option>
              </select>
            </label>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.loading}>Cargando...</div>
          ) : filteredStaff.length > 0 ? (
            <StaffTable staff={filteredStaff} />
          ) : (
            <p className={styles.noResults}>
              No se encontró personal con los criterios especificados.
            </p>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default QueryStaff;