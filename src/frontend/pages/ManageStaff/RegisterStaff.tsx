import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Alert from "../../assets/components/Alert/Alert";
import StaffNavbar from "../../assets/components/Navbar/StaffNavbar";
import styles from "./AddStaff.module.css";
import { createStaff } from "../../../backend/services/staffApi";
import StaffForm from "./RegisterStaffForm";

const ManageStaff: React.FC = () => {
  const [formData, setFormData] = useState({
    curp: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    rol: "",
    estatus: "",
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.curp ||
      !formData.nombres ||
      !formData.apellidoPaterno ||
      !formData.telefono ||
      !formData.rol
    ) {
      setAlert({
        message: "Por favor, completa todos los campos obligatorios.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const datosFormulario = {
      id: "",
      curp: formData.curp,
      nombre: formData.nombres,
      apellido:
        `${formData.apellidoPaterno} ${formData.apellidoMaterno}`.trim(),
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      telefono: formData.telefono,
      rol: formData.rol,
      estatus: formData.estatus || "ACTIVO",
      puesto: "Default Puesto", // Replace with appropriate value or form input
    };

    try {
      await createStaff(datosFormulario);
      setAlert({
        message: `Personal registrado exitosamente.`,
        type: "success",
      });
      setFormData({
        curp: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefono: "",
        rol: "",
        estatus: "",
      });
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      setAlert({
        message: error.message || "Ocurrió un error al registrar personal.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }} // Adjusted timing
      className={styles.mainContainer}>

      <StaffNavbar /> {/* Replace h1 with StaffNavbar */}
      
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.alertContainer} // Add alert container class
        >
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}
      <StaffForm
        formData={formData}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSubmit={handleSubmit}
        handleFileChange={function (
          e: React.ChangeEvent<HTMLInputElement>
        ): void {
          throw new Error("Function not implemented.");
        }}
      />
    </motion.section>
  );
};

export default ManageStaff;
