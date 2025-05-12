import React from "react";
import styles from "./Login.module.css";
import Alert from "../../assets/components/Alert/Alert";
import { useLogin } from "../../hooks/useLogin";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  const {
    telefono,
    setTelefono,
    contrasenia,
    setContrasenia,
    alert,
    setAlert,
    isSubmitting,
    handleSubmit,
  } = useLogin();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.containerRight}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <p className={styles.subtitle}>Accede al sistema con tus credenciales</p>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <LoginForm
          telefono={telefono}
          setTelefono={setTelefono}
          contrasenia={contrasenia}
          setContrasenia={setContrasenia}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <div className={styles.footer}>
            {/* <a href="/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
            </a> */}
          <p>Proyecto SIDIENE - 2025 ©</p>
        </div>
      </div>
    </div>
  );
};

export default Login;