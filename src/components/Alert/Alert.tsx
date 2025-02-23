import React from "react";
import styles from "./Alert.module.css"; // Import the CSS module

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.alert} ${styles[`alert-${type}`]}`}>
      <span className={styles["alert-message"]}>{message}</span>
      <button className={styles["alert-close"]} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;
