// src/services/studentService.js
import db from '../config/db.js';

export const registerStudent = async (studentData) => {
  const {
    curp,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    grado,
    grupo,
    anio_ingreso,
    file,
  } = studentData;

  try {
    // Insert student data into the database
    const [result] = await db.query(
      'INSERT INTO students (curp, nombres, apellido_paterno, apellido_materno, grado, grupo, anio_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [curp, nombres, apellidoPaterno, apellidoMaterno, grado, grupo, anio_ingreso]
    );

    // Handle file upload (if applicable)
    if (file) {
      // Save the file to a storage service or local directory
      // Example: Save file path to the database
      const filePath = `/uploads/${file.name}`;
      await db.query('UPDATE students SET file_path = ? WHERE id = ?', [
        filePath,
        result.insertId,
      ]);
    }

    return result.insertId; // Return the ID of the newly created student
  } catch (error) {
    console.error('Error in registerStudent service:', error);
    throw error; // Re-throw the error to handle it in the controller
  }
};