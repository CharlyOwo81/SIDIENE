import { registerStudent } from '../services/studentService.js'; // Adjust extension if .ts

export const registerStudentController = async (req, res) => {
  const { curp, nombres, apellidoPaterno, apellidoMaterno, grado, grupo, anio_ingreso } = req.body;
  const file = req.file; // File uploaded via multipart/form-data

  try {
    const result = await registerStudent(
      { curp, nombres, apellidoPaterno, apellidoMaterno, grado, grupo, anio_ingreso },
      file
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};