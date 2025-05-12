import React, { ChangeEvent, SelectHTMLAttributes } from 'react';
import styles from './SelectField.module.css';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  error = false,
  className,
  ...props
}) => {
  return (
    <select
      className={`${styles.select} ${error ? styles.error : ''} ${className || ''}`}
      {...props}
    >
      <option value="" disabled hidden>Selecciona una opción</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectField;