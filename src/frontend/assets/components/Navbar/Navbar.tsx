// Navbar.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavButton {
  label: string;
  icon: string;
  path: string;
}

interface NavbarProps {
  title: string;
  buttons: NavButton[];
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, buttons, className }) => {
  const navigate = useNavigate();

  return (
    <nav className={`${styles.navbar} ${className || ""}`}>
      <motion.h1
        className={styles.navTitle}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>
      
      <div className={styles.navLinks}>
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            className={styles.navLink}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => navigate(button.path)}
          >
            <span className={styles.navIcon}>{button.icon}</span> {button.label}
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;