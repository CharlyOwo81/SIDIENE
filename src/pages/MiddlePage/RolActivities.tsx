import React from "react";
import styles from "./RolActivities.module.css";
import { useNavigate } from "react-router-dom";

// Reusable FunctionButton Component
interface FunctionButtonProps {
  id: string;
  label: string;
  onClick: () => void;
}

const FunctionButton: React.FC<FunctionButtonProps> = ({
  id,
  label,
  onClick,
}) => (
  <div className={styles.container}>
    <button id={id} className={styles.button} onClick={onClick}></button>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
  </div>
);

type Props = {};

function RolActivities({}: Props) {
  const navigate = useNavigate();

  // Retrieve the user's role from localStorage
  const userRole = localStorage.getItem("rol") as
    | "DIRECTIVO"
    | "PREFECTO"
    | "DOCENTE"
    | "TRABAJADOR SOCIAL"
    | null;

  console.log("User Role:", userRole);

  // Define role-based permissions
  const rolePermissions = {
    DIRECTIVO: ["f1", "f2", "f3", "f4"], // Admin can access all functions
    DOCENTE: ["f1", "f2"], // User can access only function 1 and 2
    PREFECTO: ["f3"], // Manager can access function 1, 2, and 3
    "TRABAJADOR SOCIAL": ["f1", "f4"], // Social worker can access function 1 and 4
  };

  // Get the allowed functions for the current user role
  const allowedFunctions = userRole ? rolePermissions[userRole] : [];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("rol"); // Clear the user's role from localStorage
    navigate("/"); // Redirect to the login page
  };

  return (
    <>
      <h2>Rol Activities</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>{" "}
      {/* Logout button */}
      {allowedFunctions.includes("f1") && (
        <FunctionButton
          id="f1"
          label="Gestionar personal"
          onClick={() => navigate("/ManageStaff")}
        />
      )}
      {allowedFunctions.includes("f2") && (
        <FunctionButton
          id="f2"
          label="Funcion 2"
          onClick={() => navigate("/page2")}
        />
      )}
      {allowedFunctions.includes("f3") && (
        <FunctionButton
          id="f3"
          label="Funcion 3"
          onClick={() => navigate("/page3")}
        />
      )}
      {allowedFunctions.includes("f4") && (
        <FunctionButton
          id="f4"
          label="Funcion 4"
          onClick={() => navigate("/page4")}
        />
      )}
    </>
  );
}

export default RolActivities;
