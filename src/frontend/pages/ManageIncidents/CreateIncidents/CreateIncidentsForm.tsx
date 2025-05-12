import React, { ChangeEvent } from "react";
import { motion } from "framer-motion";
import Modal from "../../../assets/components/Modal/Modal";
import GoBackButton from "../../../assets/components/Button/GoBackButton";
import styles from "./CreateIncidents.module.css";
import Label from "../../../assets/components/Label/Label";
import InputField from "../../../assets/components/InputField/InputField";
import SelectField from "../../../assets/components/SelectField/SelectField";
import Button from "../../../assets/components/Button/Button";
import { motivosPorSeveridad } from "../../../../backend/constants/incidenceOptions";

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
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      nivelSeveridad: e.target.value as NivelSeveridad,
      motivo: "",
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.formContainer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Info Grid */}
        <div className={styles.section}>
        <h2 className={styles.formTitle}>Registrar Incidencias</h2>
          <h3 className={styles.sectionTitle}>Datos del Estudiante</h3>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
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
            <div className={styles.inputWrapper}>
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
            <div className={styles.inputWrapper}>
              <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
              <InputField
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={formData.apellidoPaterno || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
              <InputField
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={formData.apellidoMaterno || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="grado">Grado</Label>
              <SelectField
                name="grado"
                value={formData.grado || ""}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccionar grado" },
                  { value: "1", label: "1°" },
                  { value: "2", label: "2°" },
                  { value: "3", label: "3°" },
                ]}
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="grupo">Grupo</Label>
              <SelectField
                name="grupo"
                value={formData.grupo || ""}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccionar grupo" },
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "C", label: "C" },
                  { value: "D", label: "D" },
                  { value: "E", label: "E" },
                  { value: "F", label: "F" },
                ]}
                disabled={isSubmitting}
              />
            </div>
            <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
              <Button
                type="button"
                onClick={handleOpenModal}
                disabled={!formData.grado || !formData.grupo}
              >
                Seleccionar Estudiante
              </Button>
            </div>
          </div>
        </div>

        {/* Incidence Data Grid */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Detalles de la Incidencia</h2>
          <div className={styles.grid}>
            <div className={styles.inputWrapper}>
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
            <div className={styles.inputWrapper}>
              <Label htmlFor="usuario">Nombre del Personal</Label>
              <InputField
                type="text"
                name="usuario"
                placeholder="Nombre del usuario"
                value={formData.usuario || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="nivelSeveridad">Nivel de Severidad</Label>
              <div className={styles.radioGroup}>
                {Object.keys(motivosPorSeveridad).map((nivel) => (
                  <label key={nivel} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="nivelSeveridad"
                      value={nivel}
                      checked={formData.nivelSeveridad === nivel}
                      onChange={handleRadioChange}
                    />
                    <span className={styles.radioCircle}></span>
                    {nivel}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <Label htmlFor="motivo">Motivo</Label>
              <SelectField
                name="motivo"
                value={formData.motivo || ""}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Seleccionar motivo" },
                  ...(formData.nivelSeveridad
                    ? motivosPorSeveridad[formData.nivelSeveridad as NivelSeveridad].map((motivo) => ({
                        value: motivo,
                        label: motivo,
                      }))
                    : []),
                ]}
                disabled={!formData.nivelSeveridad || isSubmitting}
              />
            </div>
            <div className={`${styles.inputWrapper} ${styles.fullWidth}`}>
              <Label htmlFor="descripcion">Descripción de la Incidencia</Label>
              <textarea
                name="descripcion"
                placeholder="Escribe una descripción detallada de la incidencia."
                value={formData.descripcion || ""}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={styles.textarea}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <GoBackButton />
          <Button type="submit" disabled={isSubmitting || !selectedStudent}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span> Guardando...
              </>
            ) : (
              "Guardar Incidencia"
            )}
          </Button>
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