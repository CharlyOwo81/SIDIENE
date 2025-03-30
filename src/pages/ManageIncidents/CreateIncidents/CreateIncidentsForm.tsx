// CreateIncidenteForm.tsx
import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import Modal from "../../../assets/components/Modal/Modal";
import GoBackButton from "../../../assets/components/Button/GoBackButton";
import styles from "./CreateIncidents.module.css";
import Label from "../../../assets/components/Label/Label";
import InputField from "../../../assets/components/InputField/InputField";
import SelectField from "../../../assets/components/SelectField/SelectField";
import Button from "../../../assets/components/Button/Button";
import { motivosPorSeveridad } from "../../../constants/incidenceOptions";

// Definimos el tipo para los niveles de severidad
type NivelSeveridad = keyof typeof motivosPorSeveridad;

interface CreateIncidentsFormProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: (e: React.FormEvent) => void;
    handleOpenModal: () => void;
    isSubmitting: boolean;
    selectedStudent: any;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    students: any[];
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectStudent: (student: any) => void;
  }

const CreateIncidentsForm: React.FC<CreateIncidentsFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  handleOpenModal,
  handleInputChange,
  isSubmitting,
  selectedStudent,
  students,
  showModal,
  setShowModal,
  handleSelectStudent,
}) => {
  // Manejador específico para radios
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      nivelSeveridad: e.target.value as NivelSeveridad,
      motivo: ""
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={styles.formContainer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Datos del Estudiante</h2>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <Label htmlFor="curp">CURP</Label>
              <InputField 
                type="text" 
                name="curp" 
                placeholder="CURP" 
                value={formData.curp || ""} 
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <Label htmlFor="fecha">Fecha</Label>
              <InputField 
                type="text" 
                name="fecha" 
                placeholder="Fecha" 
                value={formData.fecha || ""} 
                onChange={handleInputChange}
                disabled
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <Label htmlFor="usuario">Nombre del personal</Label>
              <InputField
                type="text"
                name="usuario"
                placeholder="Nombre del usuario"
                value={formData.usuario || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            
            <div className={styles.inputGroup}>
              <Label htmlFor="grado">Grado</Label>
              <SelectField
                name="grado"
                value={formData.grado || ""}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccionar grado" },
                  { value: "1", label: "1º Grado" },
                  { value: "2", label: "2º Grado" },
                  { value: "3", label: "3º Grado" },
                ]}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.inputGroup}>
              <Label htmlFor="grupo">Grupo</Label>
              <SelectField
                name="grupo"
                value={formData.grupo || ""}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccionar grupo" },
                  { value: "A", label: "Grupo A" },
                  { value: "B", label: "Grupo B" },
                  { value: "C", label: "Grupo C" },
                  { value: "D", label: "Grupo D" },
                  { value: "E", label: "Grupo E" },
                  { value: "F", label: "Grupo F" },
                ]}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.inputGroup}>
              <Button
                type="button"
                onClick={handleOpenModal}
                disabled={!formData.grado || !formData.grupo}
              >
                Seleccionar Estudiante
              </Button>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <Label htmlFor="nombres">Nombres</Label>
              <InputField
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
              <InputField
                type="text"
                name="apellido_paterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <Label htmlFor="apellido_materno">Apellido Materno</Label>
              <InputField
                type="text"
                name="apellido_materno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Detalles de la Incidencia</h2>
          <div className={styles.lastRow}>
            <div className={styles.severityCell}>
              <Label htmlFor="nivelSeveridad">Nivel de Severidad</Label>
              <div className={styles.radioGroup}>
                {Object.keys(motivosPorSeveridad).map((nivel) => (
                  <label key={nivel} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="nivelSeveridad"
                      value={nivel as string}
                      checked={formData.nivelSeveridad === nivel}
                      onChange={handleRadioChange}
                    />
                    <span></span>
                    {nivel}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.motivoDescripcionCell}>
              <div className={styles.inputGroup}>
                <Label htmlFor="motivo">Motivo</Label>
                <SelectField
  name="motivo" // Debe coincidir con formData.motivo
  value={formData.motivo || ""}
  onChange={handleInputChange}
  options={[
    { value: "", label: "Seleccionar motivo" },
    ...(formData.nivelSeveridad
      ? motivosPorSeveridad[formData.nivelSeveridad as NivelSeveridad].map(
          (motivo) => ({ value: motivo, label: motivo })
        )
      : [])
  ]}
  disabled={!formData.nivelSeveridad}
/>
              </div>

              <div className={styles.inputGroup}>
                <Label htmlFor="descripcion">Descripción de la incidencia</Label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción del incidente"
                  value={formData.descripcion || ""}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isSubmitting || !selectedStudent}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span> Guardando
              </>
            ) : (
              'Guardar'
            )}
          </Button>
          <GoBackButton/>
        </div>
      </form>

      {showModal && (
        <Modal
          students={students}
          onClose={() => setShowModal(false)}
          onSelectStudent={handleSelectStudent}
          isOpen={showModal}
        />
      )}
    </motion.div>
  );
};

export default CreateIncidentsForm;