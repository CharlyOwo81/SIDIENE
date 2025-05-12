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

  // Cargar estudiantes por grado y grupo
  useEffect(() => {
    if (filters.grade && filters.group) {
      const fetchStudents = async () => {
        setLoading(true);
        setAlert(null);
        try {
          const response = await axios.get(
            `http://localhost:3307/api/students`,
            {
              params: { grado: filters.grade, grupo: filters.group },
            }
          );
          console.log("Students response:", response.data);
          if (response.data.success) {
            setStudents(response.data.data || []);
            setFilters((prev) => ({ ...prev, student: "", incidencia: "" }));
            setIncidencias([]);
            setFormData({ descripcion: "", estatus: "ABIERTO" });
          } else {
            setAlert(response.data.message || "Error al cargar estudiantes");
            setStudents([]);
          }
        } catch (err: any) {
          console.error(
            "Error fetching students:",
            err.response?.data || err.message
          );
          setAlert({
            // <-- Aquí estaba setError
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

  // Cargar incidencias por estudiante
  useEffect(() => {
    if (filters.student) {
      const fetchIncidencias = async () => {
        setLoading(true);
        setAlert(null);
        try {
          console.log("Fetching incidencias for CURP:", filters.student);
          const response = await axios.get(
            `http://localhost:3307/api/incidences/student/${filters.student}`
          );
          console.log("Incidencias response:", response.data);
          if (response.data.success) {
            const data = Array.isArray(response.data.data)
              ? response.data.data.map((item: { id_incidencia: any; motivo: any; descripcion: any; estado: any; fecha: string | number | Date; nivel_severidad: any; }) => ({
                  id_incidencia: item.id_incidencia,
                  motivo: item.motivo,
                  descripcion: item.descripcion || "",
                  estatus: item.estado || "ABIERTO", // Mapear 'estado' a 'estatus'
                  fecha: new Date(item.fecha).toISOString(), // Normalizar fecha
                  nivel_severidad: item.nivel_severidad || "LEVE",
                }))
              : [];
            setIncidencias(data);
            setFilters((prev) => ({ ...prev, incidencia: "" }));
            setFormData({ descripcion: "", estatus: "ABIERTO" });
            if (data.length === 0) {
              setAlert({
                // <-- Cambiar aquí
                message:
                  "No se encontraron incidencias para este estudiante. Verifica la CURP o la base de datos.",
                type: "warning",
              });
            }
          } else {
            setAlert(
              response.data.message ||
                "Estudiante no encontrado o sin incidencias"
            );
            setIncidencias([]);
          }
        } catch (err: any) {
          console.error(
            "Error fetching incidencias:",
            err.response?.data || err.message
          );
          setAlert({
            // <-- Cambiar aquí
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

  // Cargar datos de incidencia específica
  useEffect(() => {
    if (filters.incidencia) {
      const fetchIncidencia = async () => {
        setLoading(true);
        setAlert(null);
        try {
          const response = await axios.get(
            `http://localhost:3307/api/incidences/${filters.incidencia}`
          );
          console.log("Incidencia response:", response.data);
          if (response.data.success) {
            setFormData({
              descripcion: response.data.data.descripcion || "",
              estatus: response.data.data.estado || "ABIERTO", // Mapear 'estado'
            });
          } else {
            setAlert(response.data.message || "Error al cargar incidencia");
            setFormData({ descripcion: "", estatus: "ABIERTO" });
          }
        } catch (err: any) {
          console.error(
            "Error fetching incidencia:",
            err.response?.data || err.message
          );
        setAlert({ // <-- Cambiar aquí
          message: err.response?.data?.message || 'Error de conexión al cargar incidencia',
          type: 'error'
        });
          setFormData({ descripcion: "", estatus: "ABIERTO" });
        } finally {
          setLoading(false);
        }
      };
      fetchIncidencia();
    } else if (id && !filters.incidencia) {
      // Precarga desde URL si hay ID
      setFilters((prev) => ({ ...prev, incidencia: id }));
    }
  }, [filters.incidencia, id]);

  // Manejar el envío del acuerdo
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

  // Opciones para los selects
  const gradeOptions = [
    { value: "", label: "Seleccionar grado" },
    { value: "1", label: "1°" },
    { value: "2", label: "2°" },
    { value: "3", label: "3°" },
  ];

  const groupOptions = [
    { value: "", label: "Seleccionar grupo" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
  ];

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
        className={styles.mainContainer}>
        <Navbar
          title="Gestionar Expedientes"
          buttons={[
            { label: "Registrar", icon: "➕", path: "/CreateRecord" },
            { label: "Consultar", icon: "🔍", path: "/ViewRecord" },
            { label: "Actualizar", icon: "✏️", path: "/UpdateRecord" },
            { label: "Exportar", icon: "✏️", path: "/ExportRecord" },
          ]}
          className="tutor-navbar"
        />

        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.alertContainer}>
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
          transition={{ delay: 0.2 }}>
          <h1 className={styles.formTitle}>Actualizar Incidencia</h1>

          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner}></span> Cargando...
            </div>
          )}

          <div className={styles.filterSection}>
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
              options={gradeOptions}
              required
            />
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
              options={groupOptions}
              disabled={!filters.grade}
              required
            />
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
        </motion.div>
      </motion.section>
    </ErrorBoundary>
  );
};

export default UpdateRecord;