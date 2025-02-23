import React, { useState, ChangeEvent } from "react";
import styles from "./ManageStudents.module.css";
import { motion } from "framer-motion";
import axios from "axios";
import Alert from "../../components/Alert/Alert";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
}) => (
  <motion.input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    whileFocus={{ scale: 1.05 }}
    className={styles.input}
  />
);

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  children,
  disabled,
}) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.9 }}
    className={styles.button}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </motion.button>
);

const ManageStudents: React.FC = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    grade: "",
    section: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const studentData = {
      studentId: formData.studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      grade: formData.grade,
      section: formData.section,
    };

    try {
      let response;
      if (file) {
        // Si se cargó un archivo, enviarlo
        const formData = new FormData();
        formData.append("file", file);

        response = await axios.post(
          "http://localhost:5000/uploadStudents",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Si no se cargó un archivo, enviar los datos del formulario
        response = await axios.post(
          "http://localhost:5000/ManageStudents",
          studentData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      setAlert({
        message: response.data.message,
        type: "success",
      });

      setFormData({
        studentId: "",
        firstName: "",
        lastName: "",
        grade: "",
        section: "",
      });
      setFile(null);
    } catch (error: any) {
      console.error("Error submitting data:", error);
      let errorMessage = "An error occurred while processing the request.";
      if (error.response) {
        errorMessage = error.response.data.message || "Unknown server error.";
      } else if (error.request) {
        errorMessage = "No response from the server.";
      }
      setAlert({
        message: errorMessage,
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
      transition={{ duration: 0.5 }}
      className={styles.mainContainer}
    >
      <h1>Manage Students Elementary School</h1>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.containerRight}
      >
        <h2>Register/Update Student</h2>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <legend>Student Information</legend>
            <InputField
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
            />
            <InputField
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <InputField
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <InputField
              type="text"
              name="grade"
              placeholder="Grade"
              value={formData.grade}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, grade: e.target.value })
              }
            />
            <InputField
              type="text"
              name="section"
              placeholder="Section"
              value={formData.section}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, section: e.target.value })
              }
            />
            <div className={styles.fileUpload}>
              <label htmlFor="file-upload">
                Upload PDF with Students Data:
              </label>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </fieldset>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ManageStudents;
