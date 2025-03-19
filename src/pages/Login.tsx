import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert/Alert";

const Login: React.FC = () => {
  const [curp, setCurp] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    axios
      .post("http://localhost:5000/api/auth/login", { curp, contrasena })
      .then((res) => {
        console.log("Respuesta del backend:", res.data);
        if (res.data.message === "Inicio de sesión exitoso") {
          // Almacenar el rol y el nombre completo en localStorage
          localStorage.setItem("rol", res.data.user.rol);
          localStorage.setItem(
            "nombreCompleto",
            `${res.data.user.nombre} ${res.data.user.apellidoPaterno} ${res.data.user.apellidoMaterno}`
          );
          localStorage.setItem("curp", res.data.user.curp);

          setAlert({ message: "Inicio de sesión exitoso!", type: "success" });

          setTimeout(() => {
            setAlert(null);
            navigate("/RolActivities");
          }, 3000);
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        let errorMessage = "Ocurrió un error al iniciar sesión.";
        if (err.response) {
          errorMessage =
            err.response.data.message || "Error desconocido del servidor.";
        } else if (err.request) {
          errorMessage = "No se recibió respuesta del servidor.";
        }
        setAlert({ message: errorMessage, type: "error" });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className={styles["login-container"]}>
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
          placeholder="CURP"
          value={curp}
          onChange={(e) => setCurp(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
