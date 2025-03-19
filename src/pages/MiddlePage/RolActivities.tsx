import React from "react";
import styles from "./RolActivities.module.css";
import { useNavigate } from "react-router-dom";
import { functionalities } from "./ConfigActivities"; // Importar la configuración

// Reusable FunctionButton Component
interface FunctionButtonProps {
  id: string;
  label: string;
  onClick: () => void;
  icon?: string; // Cambiar a string para la ruta del icono
}

const FunctionButton: React.FC<FunctionButtonProps> = ({
  id,
  label,
  onClick,
  icon,
}) => (
  <div className={styles.container}>
    <button id={id} className={styles.button} onClick={onClick}>
      {icon && (
        <span className={styles.iconContainer}>
          <img src={icon} alt={label} className={styles.icon} />
        </span>
      )}
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </button>
  </div>
);

// Reusable TopicGroup Component
interface TopicGroupProps {
  title: string;
  children: React.ReactNode;
}

const TopicGroup: React.FC<TopicGroupProps> = ({ title, children }) => (
  <div className={styles.topicGroup}>
    <h3>{title}</h3>
    <div className={styles.buttonGroup}>{children}</div>
  </div>
);

function RolActivities() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("rol") as
    | "DIRECTIVO"
    | "PREFECTO"
    | "DOCENTE"
    | "TRABAJADOR SOCIAL"
    | null;

  // Filtrar funcionalidades permitidas para el rol actual
  const allowedFunctionalities = functionalities.filter((func) =>
    func.roles.includes(userRole || "")
  );

  // Agrupar funcionalidades por título
  const groupedFunctionalities = allowedFunctionalities.reduce((acc, func) => {
    const groupTitle = func.label.split(" ")[0]; // Ejemplo: "Gestión de Personal"
    if (!acc[groupTitle]) {
      acc[groupTitle] = [];
    }
    acc[groupTitle].push(func);
    return acc;
  }, {} as Record<string, typeof functionalities>);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("rol");
    localStorage.removeItem("nombreCompleto");
    navigate("/");
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

      <div className={styles.gridContainer}>
        {Object.entries(groupedFunctionalities).map(([title, funcs]) => (
          <TopicGroup key={title} title={title}>
            {funcs.map((func) => (
              <FunctionButton
                key={func.id}
                id={func.id}
                label={func.label}
                onClick={() => navigate(func.path)}
                icon={func.icon}
              />
            ))}
          </TopicGroup>
        ))}
      </div>
    </>
  );
}

export default RolActivities;
