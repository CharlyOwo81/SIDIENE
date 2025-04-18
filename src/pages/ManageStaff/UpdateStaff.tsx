import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./AddStaff.module.css";
import Navbar from "../../assets/components/Navbar/StaffNavbar";
import Alert from "../../assets/components/Alert/Alert";
import SearchStaffForm from "./SearchStaffForm";
import UpdateStaffForm from "./UpdateStaffForm";

interface Staff {
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
  estatus: string;
}

const UpdateStaff: React.FC = () => {
  const [searchCurp, setSearchCurp] = useState("");
  const [formData, setFormData] = useState<Staff | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchCurp(e.target.value);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCurp.trim()) {
      setAlert({
        message: "Por favor, ingresa un CURP válido.",
        type: "error",
      });
      setFormData(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3307/api/staff/${searchCurp}`
      );
      if (response.data.data) {
        const transformedData = {
          curp: response.data.data.curp,
          nombres: response.data.data.nombres,
          apellidoPaterno:
            response.data.data.apellido_paterno ||
            response.data.data.apellidoPaterno,
          apellidoMaterno:
            response.data.data.apellido_materno ||
            response.data.data.apellidoMaterno,
          rol: response.data.data.rol,
          estatus: response.data.data.estatus,
        };
        setFormData(transformedData);
        setAlert({ message: "Personal encontrado.", type: "success" });
      } else {
        setFormData(null);
        setAlert({
          message: "No se encontró personal con ese CURP.",
          type: "warning",
        });
      }
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message || "Error al buscar al personal.",
        type: "error",
      });
      setFormData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:3307/api/staff/${formData.curp}`,
        {
          nombres: formData.nombres,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          rol: formData.rol,
          estatus: formData.estatus,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setAlert({
        message: response.data.message || "Personal actualizado con éxito.",
        type: "success",
      });

      const refreshResponse = await axios.get(
        `http://localhost:3307/api/staff/${formData.curp}`
      );
      setFormData({
        ...refreshResponse.data.data,
      });
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message || "Error al actualizar el personal.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.mainContainer}
    >
      <Navbar />
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className={styles.formContainer}
      >
        <h2 className={styles.formTitle}>Actualizar Personal</h2>

        {!formData ? (
          <SearchStaffForm
            searchCurp={searchCurp}
            isLoading={isLoading}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearch}
          />
        ) : (
          <UpdateStaffForm
            formData={formData}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setFormData(null)}
          />
        )}
      </motion.div>
    </motion.section>
  );
};

export default UpdateStaff;
