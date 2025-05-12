import React from "react";
import styles from "./Login.module.css";

interface LoginFormProps {
  telefono: string;
  setTelefono: (value: string) => void;
  contrasenia: string;
  setContrasenia: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  telefono,
  setTelefono,
  contrasenia,
  setContrasenia,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.loginForm}>
      <div className={styles.inputGroup}>
        <label htmlFor="telefono" className={styles.label}>
          Teléfono
        </label>
        <input
          id="telefono"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ingresa tu teléfono"
          className={styles.input}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="contrasenia" className={styles.label}>
          Contraseña
        </label>
        <input
          id="contrasenia"
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className={styles.input}
          disabled={isSubmitting}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? "Iniciando sesión" : "Iniciar Sesión"}
      </button>
    </form>
  );
};

export default LoginForm;