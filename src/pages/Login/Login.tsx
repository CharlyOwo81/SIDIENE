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
    setAlert, // Ahora está disponible
    isSubmitting,
    handleSubmit,
  } = useLogin();

  return (
    <div className={styles["mainContainer"]}>
      <div className={styles["containerRight"]}>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)} // Esto ahora funciona
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
      </div>  
    </div>
  );
};

export default Login;