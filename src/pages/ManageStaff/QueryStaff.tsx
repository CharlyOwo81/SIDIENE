import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import styles from "./AddStaff.module.css"; // Changed to staff-specific styles
import Navbar from "../../assets/components/Navbar/StaffNavbar"; // Changed to staff navbar
import Alert from "../../assets/components/Alert/Alert";
import { getAllStaff } from "../../services/staffApi"; // Changed to staff API
import StaffQueryForm from "./QueryStaffForm"; // Import the staff form
import StaffTable from "../../assets/components/Table/StaffTable"; // Changed to staff table

interface Staff {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  puesto: string;
  departamento: string;
  fecha_ingreso: string;
  estatus: string;
}

const QueryStaff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    puesto: string[];
    departamento: string[];
    estatus: string[];
  }>({
    puesto: [],
    departamento: [],
    estatus: [],
  });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [alert, setAlert] = useState<null | { message: string; type: "success" | "error" | "warning" | "info" }>(null);
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
      const response = await getAllStaff(searchQuery, filters);
      setStaff(response.data);
      setFilteredStaff(response.data);
      setAlert({
        message: "Personal cargado correctamente.",
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        message: error.message || "Error al cargar el personal.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterStaff = () => {
    const filtered = staff.filter((member) => {
      const matchesSearch = `${member.nombres} ${member.apellidoPaterno} ${member.apellidoMaterno} ${member.puesto} ${member.departamento} ${member.fecha_ingreso}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilters =
        (filters.puesto.length === 0 || filters.puesto.includes(member.puesto)) &&
        (filters.departamento.length === 0 || filters.departamento.includes(member.departamento)) &&
        (filters.estatus.length === 0 || filters.estatus.includes(member.estatus));

      return matchesSearch && matchesFilters;
    });

    setFilteredStaff(filtered);
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

      <StaffQueryForm
        searchQuery={searchQuery}
        filters={filters}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleSubmit={handleSubmit}
      />

      <div className={styles.tableContainer}>
        {isLoading ? (
          <p>Cargando personal</p>
        ) : filteredStaff.length > 0 ? (
          <StaffTable staff={filteredStaff} />
        ) : (
          <p className={styles.noResults}>
            No se encontraron miembros del personal con los criterios especificados.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default QueryStaff;