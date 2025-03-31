import React from "react";
import { motion } from "framer-motion";
import styles from "./ReadIncidents.module.css";

interface Incident {
  id_incidencia: number;
  fecha: string;
  nivel_severidad: string;
  motivo: string;
  descripcion: string;
  nombre_estudiante: string;
  grado: string;
  grupo: string;
  nombre_personal: string;
  curp_estudiante: string;
}


interface IncidentsTableProps {
  incidents: Incident[];
  onViewPDF: (incident: Incident) => void;
}

const IncidentsTable: React.FC<IncidentsTableProps> = ({ incidents, onViewPDF }) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className={styles.tableContainer}>
      <motion.table
        className={styles.incidentsTable}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Fecha</th>
            <th>Severidad</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <motion.tr
              key={incident.id_incidencia}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ transition: { duration: 0.2 } }}
            >
              <td>{incident.nombre_estudiante}</td>
              <td>{new Date(incident.fecha).toLocaleDateString()}</td>
              <td className={styles.severityCell}>
                <span
                  className={`${styles.severityCircle} ${
                    styles[incident.nivel_severidad.toLowerCase()]
                  }`}
                ></span>
                {incident.nivel_severidad}
              </td>
              <td>{incident.motivo}</td>
              <td>
                <motion.button
                  className={styles.pdfButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewPDF(incident)}
                >
                  Ver PDF
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default IncidentsTable;