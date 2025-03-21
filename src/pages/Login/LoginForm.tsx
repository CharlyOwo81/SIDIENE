import React from "react";

interface LoginFormProps {
  telefono: string; // Asegúrate de que esta prop esté definida
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
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Teléfono"
        value={telefono} // Usa la prop `telefono`
        onChange={(e) => setTelefono(e.target.value)} // Usa la prop `setTelefono`
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasenia}
        onChange={(e) => setContrasenia(e.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};

export default LoginForm;