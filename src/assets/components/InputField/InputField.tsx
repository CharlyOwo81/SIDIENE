import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import styles from "./InputField.module.css";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <motion.input
    type={type}
    name={name}
    placeholder={placeholder}
    value={type === "file" ? undefined : value} // File inputs don't use value
    onChange={onChange}
    whileFocus={{ scale: 1.02, borderColor: "#F3C44D" }}
    whileHover={{ scale: 1.01 }}
    className={`${styles.input} ${error ? styles.error : ""} ${type === "file" ? styles.fileInput : ""}`}
    transition={{ type: "spring", stiffness: 300 }}
  />
);

export default InputField;