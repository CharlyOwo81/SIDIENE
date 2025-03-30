import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./StudentsNavbar.module.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <motion.h1
        className={styles.navTitle}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Gestionar Incidencias
      </motion.h1>
      <div className={styles.navLinks}>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => navigate("/RegisterStudents")}
        >
          <span className={styles.navIcon}>➕</span> Registrar
        </motion.button>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => navigate("/QueryStudents")}
        >
          <span className={styles.navIcon}>🔍</span> Consultar
        </motion.button>
        <motion.button
          className={styles.navLink}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => navigate("/UpdateStudents")}
        >
          <span className={styles.navIcon}>✏️</span> Actualizar
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;