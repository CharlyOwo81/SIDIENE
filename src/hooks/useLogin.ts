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
    setIsSubmitting(true);
  
    try {
      const response = await authService(telefono, contrasenia);
      
      // Check for success message
      if (response.message.toLowerCase().includes("exitoso")) {
        localStorage.setItem("curp", response.user.curp);
        localStorage.setItem("rol", response.user.rol.toUpperCase());
        localStorage.setItem("nombreCompleto", 
          `${response.user.nombres} ${response.user.apellidoPaterno} ${response.user.apellidoMaterno}`
        );
        localStorage.setItem("telefono", response.user.telefono);
        localStorage.setItem("estatus", response.user.estatus); // Store status
  
        setAlert({ message: "Inicio de sesión exitoso!", type: "success" });
        setTimeout(() => navigate("/RolActivities"), 3000);
      }
    } catch (error) {
      let errorMessage = "Ocurrió un error al iniciar sesión.";
      
      // Handle inactive/retired cases
      if ((error as Error).message.includes('account_inactivo')) {
        errorMessage = "Cuenta inactiva. Contacte al administrador.";
      } else if ((error as Error).message.includes('account_jubilado')) {
        errorMessage = "Cuenta jubilada. Acceso no permitido.";
      } 
      // Other error cases...
      
      setAlert({ message: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { telefono, setTelefono, contrasenia, setContrasenia, alert, setAlert, isSubmitting, handleSubmit };
};