import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../assets/components/Alert/Alert";

const Login: React.FC = () => {
  const [telefono, setTelefono] = useState<string>("");
  const [contrasenia, setContrasenia] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          telefono: telefono,
          contrasenia: contrasenia,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del backend:", response.data);

      if (response.data.message === "Inicio de sesión exitoso") {
        localStorage.setItem("rol", response.data.user.rol);
        localStorage.setItem(
          "nombreCompleto",
          `${response.data.user.nombre} ${response.data.user.apellidoPaterno} ${response.data.user.apellidoMaterno}`
        );
        localStorage.setItem("telefono", response.data.user.telefono);

        setAlert({ message: "Inicio de sesión exitoso!", type: "success" });

        setTimeout(() => {
          setAlert(null);
          navigate("/RolActivities");
        }, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Ocurrió un error al iniciar sesión.";
      if ((error as any).response) {
        errorMessage =
          (error as any).response.data.message ||
          "Error desconocido del servidor.";
      } else if ((error as any).request) {
        errorMessage = "No se recibió respuesta del servidor.";
      }
      setAlert({ message: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className={styles["mainContainer"]}>
      <div className={styles["containerRight"]}>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={styles["input"]}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            className={styles["input"]}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles["button"]}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
