import React from "react";
import { motion } from "framer-motion";
import styles from "./Button.module.css";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, children, disabled }) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.05, boxShadow: "0 6px 12px rgba(229, 130, 62, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className={styles.button}
    onClick={onClick}
    disabled={disabled}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.button>
);

export default Button;