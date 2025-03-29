import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './AddStaff.module.css';
import Navbar from '../../assets/components/Navbar/StaffNavbar';
import Alert from '../../assets/components/Alert/Alert';
import { getAllStaff } from '../../services/staffApi';
import StaffQueryForm from './QueryStaffForm';
import StaffTable from '../../assets/components/Table/StaffTable';

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
}

const QueryStaff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ rol: string[] }>({ rol: [] });
  const [staff, setStaff] = useState<Staff[]>([]);
  const [alert, setAlert] = useState<null | { message: string; type: 'success' | 'error' | 'warning' | 'info' }>(null);
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
    } catch (error: any) {
      setAlert({
        message: error.message || 'Error loading staff',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = `${member.nombres} ${member.apellidoPaterno} ${member.apellidoMaterno} ${member.curp}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilters = filters.rol.length === 0 || filters.rol.includes(member.rol);
    return matchesSearch && matchesFilters;
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
          <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
        </motion.div>
      )}
      <StaffQueryForm
        searchQuery={searchQuery}
        filters={filters}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleSubmit={handleSubmit}
      />
      {isLoading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <StaffTable staff={filteredStaff} />
      )}
    </motion.section>
  );
};

export default QueryStaff;