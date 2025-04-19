import React, { useEffect, useState } from "react";
import styles from "./RolActivities.module.css";
import navbarStyles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { functionalities } from "./ConfigActivities";

interface FunctionButtonProps {
  id: string;
  label: string;
  onClick: () => void;
  icon?: string;
}

const FunctionButton: React.FC<FunctionButtonProps> = ({
  id,
  label,
  onClick,
  icon,
}) => (
  <div className={styles.container}>
    <button id={id} className={styles.functionButton} onClick={onClick}>
      {icon && (
        <span className={styles.iconContainer}>
          <img src={icon} alt={label} className={styles.icon} />
        </span>
      )}
      <span>{label}</span>
    </button>
  </div>
);

function RolActivities() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("rol")?.toUpperCase() as 
  | "DIRECTIVO" 
  | "PREFECTO" 
  | "DOCENTE" 
  | "TRABAJADOR SOCIAL" 
  | null;

  // Agregar efecto de verificación inicial
useEffect(() => {
  if (!userRole) {
    navigate("/login");
  }
}, [userRole, navigate]);

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const entities = [
    { name: "Personal", keywords: ["Personal"] },
    { name: "Alumnado", keywords: ["Alumnado"] },
    { name: "Canalizaciones", keywords: ["canalización", "Channel"] },
    { name: "Incidencias", keywords: ["incidencias", "Incidents"] },
    { name: "Expedientes", keywords: ["expediente", "Record"] },
    { name: "Tutores", keywords: ["Tutores", "tutores", "tutor"] },
  ];

  const allowedFunctionalities = functionalities.filter((func) =>
    func.roles.includes(userRole || "")
  );

  const getEntityFunctions = (entityName: string) => {
    const entity = entities.find((e) => e.name === entityName);
    return allowedFunctionalities.filter((func) =>
      entity?.keywords.some((keyword) =>
        func.label.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("rol");
    localStorage.removeItem("nombreCompleto");
    navigate("/");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Funciones de {userRole}</h2>
        <div className={styles.overlayDiv}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className={navbarStyles.navbar}>
        {entities.map((entity) => {
          const entityFunctions = getEntityFunctions(entity.name);
          return (
            <div className={navbarStyles.navItem} key={entity.name}>
              <button
                className={`${navbarStyles.navButton} ${
                  selectedEntity === entity.name ? navbarStyles.active : ""
                }`}
                onClick={() => setSelectedEntity(entity.name)}
              >
                {entity.name}
              </button>
              {entityFunctions.length > 0 && (
                <div className={navbarStyles.dropdown}>
                  {entityFunctions.map((func) => (
                    <button
                      key={func.id}
                      className={navbarStyles.dropdownItem}
                      onClick={() => navigate(func.path)}
                    >
                      {func.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <main className={styles.content}>
        {selectedEntity ? (
          <>
            <h3 className={styles.entityTitle}>{selectedEntity}</h3>
            <div className={styles.functionGrid}>
              {getEntityFunctions(selectedEntity).length > 0 ? (
                getEntityFunctions(selectedEntity).map((func) => (
                  <FunctionButton
                    key={func.id}
                    id={func.id}
                    label={func.label}
                    onClick={() => navigate(func.path)}
                    icon={func.icon}
                  />
                ))
              ) : (
                <p className={styles.noFunctions}>
                  No hay funciones disponibles para este rol.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className={styles.noSelection}>
            Selecciona una opción para ver sus funciones.
          </p>
        )}
      </main>
    </div>
  );
}

export default RolActivities;