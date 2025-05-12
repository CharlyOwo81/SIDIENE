import React from "react";
import styles from "./FormSection.module.css";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <div className={styles.row}>{children}</div>
  </div>
);

export default FormSection;