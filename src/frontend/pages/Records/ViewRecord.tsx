import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExpedienteService,
  Expediente,
  Incidencia,
  Acuerdo,
} from "../../../backend/services/expedienteService";
import SelectField from "../../assets/components/SelectField/SelectField";
import Alert from "../../assets/components/Alert/Alert";
import Navbar from "../../assets/components/Navbar/Navbar";
import styles from "./ManageExpedientes.module.css";
import { gradoOptions, grupoOptions } from "../../../backend/constants/filtersOptions";
import GoBackButton from "../../assets/components/Button/GoBackButton";

const ViewRecord = () => {
  const [filters, setFilters] = useState({ grade: "", group: "" });
  const [students, setStudents] = useState<
    Array<{
      curp: string;
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string;
      grado: string;
      grupo: string;
      expediente_count: number;
    }>
  >([]);
  const [selectedExpediente, setSelectedExpediente] =
    useState<Expediente | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{
    curp: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (filters.grade && filters.group) {
        setLoading(true);
        setAlert(null);
        try {
          const response = await ExpedienteService.getStudentsWithExpediente(
            filters.grade,
            filters.group
          );
          if (response.success) {
            setStudents(
              (response.data || []).map((student) => ({
                ...student,
                grado: filters.grade,
                grupo: filters.group,
              }))
            );
          } else {
            setAlert({
              message: response.message || "Error al cargar estudiantes",
              type: "error",
            });
          }
        } catch (error) {
          setAlert({ message: "Error de conexión", type: "error" });
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
        setSelectedStudent(null);
        setSelectedExpediente(null);
      }
    };
    fetchStudents();
  }, [filters.grade, filters.group]);

  const handleSelectStudent = async (student: {
    curp: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
  }) => {
    setLoading(true);
    setAlert(null);
    setSelectedStudent(student);
    try {
      const response = await ExpedienteService.getByStudent(student.curp);
      if (response.success) {
        setSelectedExpediente(response.data?.[0] || null);
      } else {
        setAlert({
          message: response.message || "Expediente no encontrado",
          type: "warning",
        });
      }
    } catch (error) {
      setAlert({ message: "Error al cargar expediente", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.mainContainer}
    >
      <Navbar
        title="Gestionar Expedientes"
        buttons={[
          { label: "Registrar", icon: "➕", path: "/CreateRecord" },
          { label: "Consultar", icon: "🔍", path: "/ViewRecord" },
          { label: "Actualizar", icon: "✏️", path: "/UpdateRecord" },
          { label: "Exportar", icon: "📥", path: "/ExportRecord" },
        ]}
        className="tutor-navbar"
      />

      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer}
        >
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}

      <motion.div
        className={styles.formContainer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={styles.formTitle}>
          Consultar Expediente Único de Incidencias
        </h1>

        <div className={styles.filterSection}>
          <div>
            <label className={styles.filterLabel}>Grado</label>
            <SelectField
              value={filters.grade}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, grade: e.target.value }))
              }
              options={gradoOptions}
              required
            />
          </div>
          <div>
            <label className={styles.filterLabel}>Grupo</label>
            <SelectField
              value={filters.group}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, group: e.target.value }))
              }
              options={grupoOptions}
              disabled={!filters.grade}
              required
            />
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner}></span> Cargando...
          </div>
        )}

        <motion.div
          className={styles.studentCardContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {!loading &&
            filters.grade &&
            filters.group &&
            students.length === 0 && (
              <div className={styles.emptyState}>
                No hay estudiantes con expediente en este grado y grupo.
              </div>
            )}

          {students.map((student) => (
            <motion.div
              key={student.curp}
              className={`${styles.studentCard} ${
                selectedStudent?.curp === student.curp ? styles.selectedCard : ""
              }`}
              onClick={() => handleSelectStudent(student)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className={styles.studentName}>
                {`${student.nombres} ${student.apellido_paterno} ${
                  student.apellido_materno || ""
                }`.trim()}
              </p>
              <div className={styles.badge}>
                {student.expediente_count} incidencia
                {student.expediente_count !== 1 ? "s" : ""}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {selectedStudent && !loading && (
          <motion.div
            className={styles.expedienteSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={styles.expedienteTitle}>
              Expediente de{" "}
              {`${selectedStudent.nombres} ${
                selectedStudent.apellido_paterno
              } ${selectedStudent.apellido_materno || ""}`.trim()}
            </h2>

            {selectedExpediente ? (
              <div className={styles.incidentList}>
                {selectedExpediente.incidencias.map((incidencia: Incidencia) => (
                  <motion.div
                    key={incidencia.id_incidencia}
                    className={styles.incidentItem}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.incidentHeader}>
                      <div
                        className={styles.severityBadge}
                        data-severity={incidencia.nivel_severidad}
                      >
                        {incidencia.nivel_severidad}
                      </div>
                      <span>
                        {new Date(incidencia.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.incidentContent}>
                      <h3>{incidencia.motivo}</h3>
                      <p>{incidencia.descripcion}</p>

                      {incidencia.acuerdos.length > 0 && (
                        <div className={styles.acuerdoSection}>
                          <h4>Acuerdos establecidos:</h4>
                          {incidencia.acuerdos.map((acuerdo: Acuerdo) => (
                            <div
                              key={acuerdo.id_acuerdo}
                              className={styles.acuerdoItem}
                            >
                              <div
                                className={styles.acuerdoStatus}
                                data-status={acuerdo.estatus}
                              >
                                {acuerdo.estatus}
                              </div>
                              <p>{acuerdo.descripcion}</p>
                              <small>
                                Creado el:{" "}
                                {new Date(
                                  acuerdo.fecha_creacion
                                ).toLocaleDateString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No se encontró expediente para este estudiante.
              </div>
            )}
          </motion.div>
        )}

        <div className={styles.formActions}>
          <GoBackButton/>
          <button className={styles.submitButton} disabled>
            Consultar Expediente
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ViewRecord;