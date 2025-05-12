import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./GoBackButton.module.css";

const GoBackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/RolActivities"); // Go back to the previous page
  };

  return (
    <motion.button
      type="button"
      onClick={handleGoBack}
      whileHover={{ scale: 1.05, boxShadow: "0 6px 12px rgba(229, 130, 62, 0.3)" }}
      whileTap={{ scale: 0.95 }}
      className={styles.goBackButton}
      transition={{ type: "spring", stiffness: 300 }}
    >
      Volver
    </motion.button>
  );
};

export default GoBackButton;