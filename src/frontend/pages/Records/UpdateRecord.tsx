import { useState, useEffect, Component } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import SelectField from "../../assets/components/SelectField/SelectField";
import AgreementForm from "./AgreementForm";
import styles from "./ManageExpedientes.module.css";
import Navbar from "../../assets/components/Navbar/Navbar";
import Alert from "../../assets/components/Alert/Alert";
import { ReactNode } from "react";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import { gradoOptions, grupoOptions } from "../../../backend/constants/filtersOptions";
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorState}>
          Algo salió mal. Por favor, intenta de nuevo.
        </div>
      );
    }
    return this.props.children;
  }
}

const UpdateRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    grade: "",
    group: "",
    student: "",
    incidencia: "",
  });
  const [formData, setFormData] = useState({
    descripcion: "",
    estatus: "ABIERTO",
  });
  const [students, setStudents] = useState<
    Array<{
      curp: string;
      nombres: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
    }>
  >([]);
  const [incidencias, setIncidencias] = useState<
    Array<{
      id_incidencia: number;
      motivo: string;
      descripcion: string;
      estatus: string;
      fecha: string;
      nivel_severidad: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    if (filters.grade && filters.group) {
      const fetchStudents = async () => {
        setLoading(true);
        setAlert(null);
        try {
          const response = await axios.get(`http://localhost:3307/api/students`, {
            params: { grado: filters.grade, grupo: filters.group },
          });
          if (response.data.success) {
            setStudents(response.data.data || []);
            setFilters((prev) => ({ ...prev, student: "", incidencia: "" }));
            setIncidencias([]);
            setFormData({ descripcion: "", estatus: "ABIERTO" });
          } else {
            setAlert({
              message: response.data.message || "Error al cargar estudiantes",
              type: "error",
            });
            setStudents([]);
          }
        } catch (err: any) {
          setAlert({
            message:
              err.response?.data?.message ||
              "Error de conexión al cargar estudiantes",
            type: "error",
          });
          setStudents([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
      setIncidencias([]);
      setFilters((prev) => ({ ...prev, student: "", incidencia: "" }));
      setFormData({ descripcion: "", estatus: "ABIERTO" });
    }
  }, [filters.grade, filters.group]);

  useEffect(() => {
    if (filters.student) {
      const fetchIncidencias = async () => {
        setLoading(true);
        setAlert(null);
        try {
          const response = await axios.get(
            `http://localhost:3307/api/incidences/student/${filters.student}`
          );
          if (response.data.success) {
            const data = Array.isArray(response.data.data)
              ? response.data.data.map((item: any) => ({
                  id_incidencia: item.id_incidencia,
                  motivo: item.motivo,
                  descripcion: item.descripcion || "",
                  estatus: item.estado || "ABIERTO",
                  fecha: new Date(item.fecha).toISOString(),
                  nivel_severidad: item.nivel_severidad || "LEVE",
                }))
              : [];
            setIncidencias(data);
            setFilters((prev) => ({ ...prev, incidencia: "" }));
            setFormData({ descripcion: "", estatus: "ABIERTO" });
            if (data.length === 0) {
              setAlert({
                message:
                  "No se encontraron incidencias para este estudiante.",
                type: "warning",
              });
            }
          } else {
            setAlert({
              message:
                response.data.message ||
                "Estudiante no encontrado o sin incidencias",
              type: "error",
            });
            setIncidencias([]);
          }
        } catch (err: any) {
          setAlert({
            message:
              err.response?.status === 404
                ? "Estudiante no encontrado o sin incidencias"
                : err.response?.data?.message ||
                  "Error de conexión al cargar incidencias",
            type: "error",
          });
          setIncidencias([]);
        } finally {
          setLoading(false);
        }
      };
      fetchIncidencias();
    } else {
      setIncidencias([]);
      setFilters((prev) => ({ ...prev, incidencia: "" }));
      setFormData({ descripcion: "", estatus: "ABIERTO" });
    }
  }, [filters.student]);

  useEffect(() => {
    if (filters.incidencia) {
      const fetchIncidencia = async () => {
        setLoading(true);
        setAlert(null);
        try {
          const response = await axios.get(
            `http://localhost:3307/api/incidences/${filters.incidencia}`
          );
          if (response.data.success) {
            setFormData({
              descripcion: response.data.data.descripcion || "",
              estatus: response.data.data.estado || "ABIERTO",
            });
          } else {
            setAlert({
              message: response.data.message || "Error al cargar incidencia",
              type: "error",
            });
            setFormData({ descripcion: "", estatus: "ABIERTO" });
          }
        } catch (err: any) {
          setAlert({
            message:
              err.response?.data?.message ||
              "Error de conexión al cargar incidencia",
            type: "error",
          });
          setFormData({ descripcion: "", estatus: "ABIERTO" });
        } finally {
          setLoading(false);
        }
      };
      fetchIncidencia();
    } else if (id && !filters.incidencia) {
      setFilters((prev) => ({ ...prev, incidencia: id }));
    }
  }, [filters.incidencia, id]);

  const handleAgreementSubmit = async (data: {
    id_acuerdo?: string;
    descripcion: string;
    estatus: string;
    fecha_creacion: string;
    id_incidencia: string;
  }) => {
    setLoading(true);
    setAlert(null);
    try {
      const response = await axios.post(
        `http://localhost:3307/api/incidences/${filters.incidencia}/acuerdos`,
        {
          descripcion: data.descripcion,
          estatus: data.estatus,
        }
      );

      if (response.data.success) {
        setAlert({
          message: "¡Acuerdo actualizado correctamente!",
          type: "success",
        });
        setTimeout(() => navigate(`/ViewRecord`), 1500);
      } else {
        setAlert({
          message: response.data.message || "Error al crear acuerdo",
          type: "error",
        });
      }
    } catch (err: any) {
      setAlert({
        message:
          err.response?.data?.message || "Error de conexión al crear acuerdo",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const studentOptions = [
    {
      value: "",
      label:
        students.length === 0
          ? "No hay estudiantes disponibles"
          : "Seleccionar estudiante",
    },
    ...students.map((student) => ({
      value: student.curp,
      label:
        `${student.nombres || ""} ${student.apellidoPaterno || ""} ${
          student.apellidoMaterno || ""
        }`.trim() || "Nombre no disponible",
    })),
  ];

  const incidenciaOptions = [
    {
      value: "",
      label:
        incidencias.length === 0
          ? "No hay incidencias disponibles"
          : "Seleccionar incidencia",
    },
    ...incidencias.map((incidencia) => ({
      value: incidencia.id_incidencia.toString(),
      label: `${incidencia.motivo} (${new Date(
        incidencia.fecha
      ).toLocaleDateString()})`,
    })),
  ];

  return (
    <ErrorBoundary>
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
          <h1 className={styles.formTitle}>Actualizar Expediente Único de Incidencias</h1>

          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner}></span> Cargando...
            </div>
          )}

          <div className={styles.filterSection}>
            <div>
              <label className={styles.filterLabel}>Grado</label>
              <SelectField
                value={filters.grade}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    grade: e.target.value,
                    group: "",
                    student: "",
                    incidencia: "",
                  }))
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
                  setFilters((prev) => ({
                    ...prev,
                    group: e.target.value,
                    student: "",
                    incidencia: "",
                  }))
                }
                options={grupoOptions}
                disabled={!filters.grade}
                required
              />
            </div>
            <div>
              <label className={styles.filterLabel}>Estudiante</label>
              <SelectField
                value={filters.student}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    student: e.target.value,
                    incidencia: "",
                  }))
                }
                options={studentOptions}
                disabled={!filters.grade || !filters.group || !students.length}
                required
              />
            </div>
            <div>
              <label className={styles.filterLabel}>Incidencia</label>
              <SelectField
                value={filters.incidencia}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, incidencia: e.target.value }))
                }
                options={incidenciaOptions}
                disabled={!filters.student}
                required
              />
            </div>
          </div>

          {filters.incidencia && (
            <AgreementForm
              initialData={{
                descripcion: formData.descripcion,
                estatus: formData.estatus,
                id_acuerdo: "",
                fecha_creacion: new Date().toISOString(),
                id_incidencia: filters.incidencia,
              }}
              onSubmit={handleAgreementSubmit}
            />
          )}

          <div className={styles.formActions}>
            <GoBackButton/>
            <button
              className={styles.submitButton}
              onClick={() =>
                handleAgreementSubmit({
                  descripcion: formData.descripcion,
                  estatus: formData.estatus,
                  fecha_creacion: new Date().toISOString(),
                  id_incidencia: filters.incidencia,
                })
              }
              disabled={!filters.incidencia || loading}
            >
              Crear Acuerdo
            </button>
          </div>
        </motion.div>
      </motion.section>
    </ErrorBoundary>
  );
};

export default UpdateRecord;