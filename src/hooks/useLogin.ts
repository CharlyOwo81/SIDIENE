import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useLogin = () => {
  const [telefono, setTelefono] = useState<string>("");
  const [contrasenia, setContrasenia] = useState<string>("");
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
    setIsSubmitting(true);

    try {
      console.log("Teléfono:", telefono, "Contraseña:", contrasenia);
      const response = await authService(telefono, contrasenia);
      if (response.message.toLowerCase().includes("exitoso")) {
        localStorage.setItem("curp", response.user.curp);
        localStorage.setItem("rol", response.user.rol.toUpperCase());
        localStorage.setItem(
          "nombreCompleto",
          `${response.user.nombres} ${response.user.apellidoPaterno} ${response.user.apellidoMaterno}`
        );
        localStorage.setItem("telefono", response.user.telefono);

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
        errorMessage = (error as any).response.data.message || "Error desconocido del servidor.";
      } else if ((error as any).request) {
        errorMessage = "No se recibió respuesta del servidor.";
      }
      setAlert({ message: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { telefono, setTelefono, contrasenia, setContrasenia, alert, setAlert, isSubmitting, handleSubmit };
};