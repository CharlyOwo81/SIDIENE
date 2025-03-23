import React, { useEffect } from "react";
import styles from "./Alert.module.css";

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  headerHeight?: number; // Optional prop for custom positioning
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose, headerHeight = 0 }) => {
  // Auto-Dismiss: Close the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 seconds
    return () => clearTimeout(timer); // Cleanup on unmount or onClose change
  }, [onClose]);

  return (
    <div
      className={`${styles.alert} ${styles[`alert-${type}`]} ${styles["custom-top"]}`}
      data-header-height={headerHeight} // Pass headerHeight as a data attribute
    >
      {/* Icon Addition: Display an icon based on alert type */}
      <span className={styles["alert-icon"]}>
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </span>
      <span className={styles["alert-message"]}>{message}</span>
      <button className={styles["alert-close"]} onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Alert;