import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Import the CSS module

interface Entity {
  name: string;
  functions: { id: string; label: string; path: string }[];
}

interface NavbarProps {
  entities: Entity[];
}

const Navbar: React.FC<NavbarProps> = ({ entities }) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const navigate = useNavigate();

  const getEntityFunctions = (entityName: string) => {
    const entity = entities.find((e) => e.name === entityName);
    return entity ? entity.functions : [];
  };

  return (
    <nav className={styles.navbar}>
      {entities.map((entity) => {
        const entityFunctions = getEntityFunctions(entity.name);
        return (
          <div className={styles.navItem} key={entity.name}>
            <button
              className={`${styles.navButton} ${
                selectedEntity === entity.name ? styles.active : ""
              }`}
              onClick={() => setSelectedEntity(entity.name)}
            >
              {entity.name}
            </button>
            {entityFunctions.length > 0 && (
              <div className={styles.dropdown}>
                {entityFunctions.map((func) => (
                  <button
                    key={func.id}
                    className={styles.dropdownItem}
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
  );
};

export default Navbar;