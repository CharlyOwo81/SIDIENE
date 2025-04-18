import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import styles from "../ManageStudents/QueryStudents.module.css"; // Use same styles as QueryStudents
import Navbar from "../../assets/components/Navbar/StaffNavbar";
import Alert from "../../assets/components/Alert/Alert";
import { getAllStaff } from "../../services/staffApi";
import QueryStaffForm from "./QueryStaffForm";
import StaffTable from "../../assets/components/Table/StaffTable";

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
}

const QueryStaff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ rol: string[] }>({ rol: [] });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
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
      const response = await getAllStaff(searchQuery, filters);

      // Handle warning response
      if (response.data.isWarning) {
        setAlert({
          message: response.data.warning,
          type: "warning",
        });
        setStaff([]);
        setFilteredStaff([]);
      } else {
        setStaff(response.data.data);
        setFilteredStaff(response.data.data);
        setAlert({
          message: "Personal cargado correctamente.",
          type: "success",
        });
      }
    } catch (error: any) {
      setAlert({
        message: error.message || "Error al cargar al personal.",
        type: "error",
      });
      setStaff([]);
      setFilteredStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStaff = () => {
    const filtered = staff.filter((member) => {
      const matchesSearch =
        `${member.nombres} ${member.apellidoPaterno} ${member.apellidoMaterno} ${member.curp} ${member.rol}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFilters =
        filters.rol.length === 0 || filters.rol.includes(member.rol);
      return matchesSearch && matchesFilters;
    });
    setFilteredStaff(filtered);
  };

  // Call filterStaff whenever searchQuery or filters change (similar to QueryStudents behavior)
  React.useEffect(() => {
    filterStaff();
  }, [searchQuery, filters, staff]);

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
          />
        </motion.div>
      )}

      <QueryStaffForm
        searchQuery={searchQuery}
        filters={filters}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleSubmit={handleSubmit}
      />

      <div className={styles.tableContainer}>
        {isLoading ? (
          <p>Cargando personal...</p>
        ) : filteredStaff.length > 0 ? (
          <StaffTable staff={filteredStaff} />
        ) : (
          <p className={styles.noResults}>
            {staff.length === 0
              ? "Utilice los filtros para buscar personal"
              : "No se encontró personal con los criterios especificados"}
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default QueryStaff;
