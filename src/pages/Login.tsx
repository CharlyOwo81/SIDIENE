import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert/Alert"; // Import Alert component

const Login: React.FC = () => {
  const [curp, setCurp] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Sending login request:", { curp, contrasena });

    axios
      .post("http://localhost:5000/login", { curp, contrasena })
      .then((res) => {
        console.log("Login response:", res.data);
        if (res.data.message === "Inicio de sesión exitoso") {
          localStorage.setItem("rol", res.data.user.rol);
          setAlert({ message: "Inicio de sesión exitoso!", type: "success" });

          setTimeout(() => {
            setAlert(null); // Ocultar la alerta después de 3 segundos
            navigate("/RolActivities");
          }, 3000);
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response) {
          setAlert({
            message: err.response.data.message || "Error desconocido",
            type: "error",
          });
        } else if (err.request) {
          setAlert({
            message: "No se recibió respuesta del servidor.",
            type: "warning",
          });
        } else {
          setAlert({
            message: "Ocurrió un error al iniciar sesión.",
            type: "error",
          });
        }
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
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
