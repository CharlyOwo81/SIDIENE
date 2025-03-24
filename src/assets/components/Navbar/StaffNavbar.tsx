// src/assets/components/Navbar/StaffNavbar.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./StaffNavbar.module.css"; // Use a separate CSS module

const StaffNavbar: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <nav className={styles.navbar}>
      <motion.h1
        className={styles.navTitle}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Gestionar Personal
      </motion.h1>
      <div className={styles.navLinks}>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.1, color: "#E5823E", y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/RegisterStaff")} // Staff-specific route
        >
          <span className={styles.navIcon}>➕</span> Registrar
        </motion.button>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.1, color: "#E5823E", y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/QueryStaff")} // Staff-specific route
        >
          <span className={styles.navIcon}>🔍</span> Consultar
        </motion.button>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.1, color: "#E5823E", y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/UpdateStaff")} // Staff-specific route
        >
          <span className={styles.navIcon}>✏️</span> Actualizar
        </motion.button>
      </div>
    </nav>
  );
};

export default StaffNavbar;