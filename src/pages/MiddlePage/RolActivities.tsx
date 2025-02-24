import React from "react";
import styles from "./RolActivities.module.css";
import { useNavigate } from "react-router-dom";

// Import local images
import personalIcon from "../../../public/chalkboard-user.svg";
import alumnadoIcon from "../../../public/student.svg";
import reportesIcon from "../../../public/exclamation.svg";
import funcion4Icon from "../../../public/paper-plane-launch.svg";

// Reusable FunctionButton Component
interface FunctionButtonProps {
  id: string;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode; // Optional icon prop
}

const FunctionButton: React.FC<FunctionButtonProps> = ({
  id,
  label,
  onClick,
  icon, // Destructure the icon prop
}) => (
  <div className={styles.container}>
    <button id={id} className={styles.button} onClick={onClick}>
      {icon && <span className={styles.iconContainer}>{icon}</span>}{" "}
      {/* Render the icon if provided */}
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </button>
  </div>
);

// Reusable TopicGroup Component
interface TopicGroupProps {
  title: string;
  functionIds: string[];
  allowedFunctions: string[]; // Add allowedFunctions as a prop
  children: React.ReactNode;
}

const TopicGroup: React.FC<TopicGroupProps> = ({
  title,
  functionIds,
  allowedFunctions, // Receive allowedFunctions as a prop
  children,
}) => {
  const hasAllowedFunctions = (functionIds: string[]) => {
    return functionIds.some((id) => allowedFunctions.includes(id));
  };

  if (!hasAllowedFunctions(functionIds)) return null;

  return (
    <div className={styles.topicGroup}>
      <h3>{title}</h3>
      <div className={styles.buttonGroup}>{children}</div>
    </div>
  );
};

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
    DIRECTIVO: ["f1", "f2", "f5", "f6", "f7", "f8", "f9", "f11", "f12", "f13"], // Admin can access all functions
    DOCENTE: ["f7"], // User can access only function 1 and 2
    PREFECTO: ["f7", "f8", "f9"], // Manager can access function 1, 2, and 3
    "TRABAJADOR SOCIAL": ["f3", "f4", "f5", "f8", "f11", "f12", "f13"], // Social worker can access function 1 and 4
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
      <div className={styles.header}>
        <h2 className={styles.title}>Funciones de {userRole}</h2>
        <div className={styles.overlayDiv}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenedor principal de la cuadrícula */}
      <div className={styles.gridContainer}>
        {/* Grupo 1: Gestión de personal */}
        <TopicGroup
          title="Gestión de Personal y Alumnado"
          functionIds={["f1", "f2"]}
          allowedFunctions={allowedFunctions} // Pass allowedFunctions
        >
          {allowedFunctions.includes("f1") && (
            <FunctionButton
              id="f1"
              label="Personal"
              onClick={() => navigate("/ManageStaff")}
              icon={
                <img
                  src={personalIcon}
                  alt="Personal"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f2") && (
            <FunctionButton
              id="f2"
              label="Alumnado"
              onClick={() => navigate("/ManageStudents")}
              icon={
                <img
                  src={alumnadoIcon}
                  alt="Alumnado"
                  className={styles.icon}
                />
              }
            />
          )}
        </TopicGroup>

        {/* Grupo 2: Canalizaciones */}
        <TopicGroup
          title="Gestión de Canalizaciones"
          functionIds={["f3", "f4", "f5", "f6"]}
          allowedFunctions={allowedFunctions} // Pass allowedFunctions
        >
          {allowedFunctions.includes("f3") && (
            <FunctionButton
              id="f3"
              label="Crear canalización"
              onClick={() => navigate("/page3")}
              icon={
                <img
                  src={reportesIcon}
                  alt="Reportes"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f4") && (
            <FunctionButton
              id="f4"
              label="Consultar canalización"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f5") && (
            <FunctionButton
              id="f5"
              label="Actualizar canalización"
              onClick={() => navigate("/page3")}
              icon={
                <img
                  src={reportesIcon}
                  alt="Reportes"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f6") && (
            <FunctionButton
              id="f6"
              label="Acceder a Estatus de Canalización"
              onClick={() => navigate("/page3")}
              icon={
                <img
                  src={reportesIcon}
                  alt="Reportes"
                  className={styles.icon}
                />
              }
            />
          )}
        </TopicGroup>

        {/* Grupo 3: Incidencias */}
        <TopicGroup
          title="Gestión de Incidencias"
          functionIds={["f7", "f8", "f9"]}
          allowedFunctions={allowedFunctions} // Pass allowedFunctions
        >
          {allowedFunctions.includes("f7") && (
            <FunctionButton
              id="f7"
              label="Crear incidencias"
              onClick={() => navigate("/page3")}
              icon={
                <img
                  src={reportesIcon}
                  alt="Reportes"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f8") && (
            <FunctionButton
              id="f8"
              label="Consultar incidencias"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f9") && (
            <FunctionButton
              id="f9"
              label="Actualizar incidencias"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
        </TopicGroup>

        {/* Grupo 4: Expediente Único de Incidencias */}
        <TopicGroup
          title="Gestión de Expediente Único de Incidencias"
          functionIds={["f10", "f11", "f12", "f13"]}
          allowedFunctions={allowedFunctions} // Pass allowedFunctions
        >
          {allowedFunctions.includes("f10") && (
            <FunctionButton
              id="f10"
              label="Crear expediente"
              onClick={() => navigate("/page3")}
              icon={
                <img
                  src={reportesIcon}
                  alt="Reportes"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f11") && (
            <FunctionButton
              id="f11"
              label="Consultar expediente"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f12") && (
            <FunctionButton
              id="f12"
              label="Actualizar expediente"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
          {allowedFunctions.includes("f13") && (
            <FunctionButton
              id="f13"
              label="Exportar expediente a PDF"
              onClick={() => navigate("/page4")}
              icon={
                <img
                  src={funcion4Icon}
                  alt="Funcion 4"
                  className={styles.icon}
                />
              }
            />
          )}
        </TopicGroup>
      </div>
    </>
  );
}

export default RolActivities;
