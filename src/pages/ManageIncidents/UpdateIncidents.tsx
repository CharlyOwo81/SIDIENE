// src/components/UpdateIncidents.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import Alert from "../../assets/components/Alert/Alert";
import GoBackButton from "../../assets/components/Button/GoBackButton";
import styles from "../ManageIncidents/CreateIncidents/CreateIncidents.module.css";
import Label from "../../assets/components/Label/Label";
import InputField from "../../assets/components/InputField/InputField";
import SelectField from "../../assets/components/SelectField/SelectField";
import Button from "../../assets/components/Button/Button";
import { motivosPorSeveridad } from "../../constants/incidenceOptions";
import axios from "axios";
import Navbar from "../../assets/components/Navbar/IncidentsNavbar";

type NivelSeveridad = keyof typeof motivosPorSeveridad;

interface Incident {
  id_incidencia: string;
  fecha: string;
  nivel_severidad: NivelSeveridad;
  motivo: string;
  descripcion: string;
  curp_estudiante: string;
  nombre_estudiante: string;
  grado: string;
  grupo: string;
  nombre_personal: string;
  estado: "PENDIENTE" | "ACTUALIZADO";
}

const UpdateIncidents: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({
    fecha: "",
    nombre: "",
    severidad: "",
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:3307/api/incidences/filter",
        {
          params: {
            fecha: searchFilters.fecha || undefined,
            nombre: searchFilters.nombre || undefined,
            severidad: searchFilters.severidad.toUpperCase() || undefined,
          },
        }
      );

      setIncidents(response.data.data);
      setFilteredIncidents(response.data.data);
      setShowResultsModal(true);
      setAlert({
        message: response.data.message,
        type: "success",
      });
    } catch (error) {
      console.error("Error searching incidents:", error);
      if (axios.isAxiosError(error)) {
        setAlert({
          message:
            "Error al buscar incidencias: " +
            (error.response?.data?.message || "Error desconocido"),
          type: "error",
        });
      } else {
        setAlert({
          message: "Error al buscar incidencias: " + String(error),
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleModalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = incidents.filter(
      (incident) =>
        incident.nombre_estudiante.toLowerCase().includes(term) ||
        incident.nivel_severidad.toLowerCase().includes(term) ||
        incident.motivo.toLowerCase().includes(term)
    );
    setFilteredIncidents(filtered);
  };

  // UpdateIncidents.tsx
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || selectedIncident.estado === "ACTUALIZADO") return;
  
    setIsSubmitting(true);
    try {
      // Validación de datos antes de enviar
      if (!selectedIncident.motivo || !selectedIncident.nivel_severidad) {
        throw new Error("Todos los campos requeridos deben estar completos");
      }
  
      const response = await axios.put(
        `http://localhost:3307/api/incidences/${selectedIncident.id_incidencia}`,
        {
          ...selectedIncident,
          estado: "ACTUALIZADO",
          fecha: new Date(selectedIncident.fecha).toISOString() // Formatear fecha
        }
      );
  
      // Actualizar estado local
      const updatedIncidents = incidents.map(inc => 
        inc.id_incidencia === selectedIncident.id_incidencia 
          ? response.data.data 
          : inc
      );
  
      setIncidents(updatedIncidents);
      setSelectedIncident(null);
  
      setAlert({
        message: "Incidencia actualizada con éxito",
        type: "success"
      });
  
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        message: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Error de conexión"
          : "Error al guardar cambios",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.formContainer}>
        <Navbar/>
      {/* Alert fuera del contenido principal */}
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}>
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}
      

      {/* Formulario de Búsqueda */}
      <div className={styles.section}>
        <h2 className={styles.formTitle}>Buscar Incidencias</h2>
        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
              <Label htmlFor="fecha">Fecha</Label>
              <InputField
                type="date"
                name="fecha"
                value={searchFilters.fecha}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, fecha: e.target.value })
                }
                placeholder={""}
              />
            </div>

            <div className={styles.inputWrapper}>
              <Label htmlFor="nombre">Nombre del Estudiante</Label>
              <InputField
                type="text"
                name="nombre"
                placeholder="Buscar por nombre"
                value={searchFilters.nombre}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, nombre: e.target.value })
                }
              />
            </div>

            <div className={styles.inputWrapper}>
              <Label htmlFor="severidad">Nivel de Severidad</Label>
              <SelectField
                name="severidad"
                value={searchFilters.severidad}
                options={[
                  { value: "", label: "Todos" },
                  ...Object.keys(motivosPorSeveridad).map((severidad) => ({
                    value: severidad,
                    label: severidad,
                  })),
                ]}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    severidad: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputWrapper}>
              <Button type="submit" disabled={loading}>
                {loading ? "Buscando..." : "Buscar Incidencias"}
              </Button>
              <GoBackButton />
            </div>
          </div>
        </form>
      </div>

      {/* Modal de Resultados */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Resultados de Búsqueda">
        <div className={styles.modalContent}>
          <div className={styles.searchBar}>
            <InputField
              type="text"
              placeholder="Buscar en resultados..."
              value={searchTerm}
              onChange={handleModalSearch}
              name={"Buscar"}
            />
          </div>

          <div className={styles.resultsList}>
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id_incidencia}
                className={`${styles.resultItem} ${
                  selectedIncident?.id_incidencia === incident.id_incidencia
                    ? styles.selected
                    : ""
                }`}
                onClick={() => {
                  setSelectedIncident(incident);
                  setShowResultsModal(false);
                }}>
                <div className={styles.resultDate}>
                  {new Date(incident.fecha).toLocaleDateString()}
                </div>
                <div className={styles.resultName}>
                  {incident.nombre_estudiante}
                </div>
                <div className={styles.resultSeverity}>
                  {incident.nivel_severidad}
                </div>
                <div className={styles.resultMotivo}>{incident.motivo}</div>
                <div className={styles.statusIndicator}>
                  {incident.estado === "PENDIENTE" ? (
                    <span className={styles.pending}>🟡 PENDIENTE</span>
                  ) : (
                    <span className={styles.updated}>🟢 ACTUALIZADO</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Formulario de Edición */}
      {selectedIncident && (
        <div className={styles.section}>
          {selectedIncident.estado === "ACTUALIZADO" && (
            <div className={styles.alert}>
              ⚠️ Esta incidencia ya fue actualizada y no puede modificarse
            </div>
          )}
          <h2 className={styles.formTitle}>Editar Incidencia</h2>
          <form onSubmit={handleUpdate} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.inputWrapper}>
                <Label htmlFor="fecha">Fecha</Label>

                <InputField
                  type="date"
                  name="fecha"
                  value={selectedIncident.fecha}
                  onChange={(e) =>
                    setSelectedIncident({
                      ...selectedIncident,
                      fecha: e.target.value,
                    })
                  }
                  placeholder={""}
                  disabled
                />
              </div>

              <div className={styles.inputWrapper}>
                <Label htmlFor="nivel_severidad">Nivel de Severidad</Label>
                <SelectField
                  name="nivel_severidad"
                  value={selectedIncident.nivel_severidad}
                  options={Object.keys(motivosPorSeveridad).map(
                    (severidad) => ({
                      value: severidad,
                      label: severidad,
                    })
                  )}
                  onChange={(e) =>
                    setSelectedIncident({
                      ...selectedIncident,
                      nivel_severidad: e.target.value as NivelSeveridad,
                      motivo: "",
                    })
                  }
                />
              </div>
              </div>
              {/* Replace SelectField with InputField for motivo */}
              {/* Campo Motivo Corregido */}
              <div className={styles.inputWrapper}>
                <Label htmlFor="motivo">Motivo</Label>
                <SelectField
                  name="motivo"
                  value={selectedIncident.motivo}
                  options={[
                    { value: "", label: "Selecciona un motivo" },
                    // Opciones estándar
                    ...(motivosPorSeveridad[selectedIncident.nivel_severidad] || []).map((motivo) => ({
                      value: motivo,
                      label: motivo,
                    })),
                    // Opción adicional para motivos antiguos no listados
                    ...(!motivosPorSeveridad[selectedIncident.nivel_severidad]?.includes(
                      selectedIncident.motivo
                    )
                      ? [
                          {
                            value: selectedIncident.motivo,
                            label: `${selectedIncident.motivo} (motivo original)`,
                          },
                        ]
                      : []),
                  ]}
                  onChange={(e) => {
                    // Solo permite seleccionar nuevos motivos válidos
                    if (e.target.value !== selectedIncident.motivo) {
                      setSelectedIncident({
                        ...selectedIncident,
                        motivo: e.target.value,
                      });
                    }
                  }}
                  required={selectedIncident.estado === "PENDIENTE"}
                />


              <div className={styles.inputWrapper}>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  value={selectedIncident.descripcion}
                  onChange={(e) =>
                    setSelectedIncident({
                      ...selectedIncident,
                      descripcion: e.target.value,
                    })
                  }
                  className={styles.textarea}
                />
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Button type="button" onClick={() => setSelectedIncident(null)}>
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default UpdateIncidents;
