import db from '../config/db.js';
import { isValidDate, formatDateForMySQL } from '../utils/utils.js';

// 1. Registrar una incidencia
export const uploadIncidents = (req, res) => {
  const {
    id_estudiante,
    id_personal,
    fecha,
    nivel_severidad,
    motivo,
    descripcion,
  } = req.body;

  // Validar campos requeridos
  if (
    !id_estudiante ||
    !id_personal ||
    !fecha ||
    !nivel_severidad ||
    !motivo ||
    !descripcion
  ) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Validar formato de fecha
  if (!isValidDate(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha no válido. Use DD/MM/YYYY' });
  }

  // Formatear fecha para MySQL
  const formattedDate = formatDateForMySQL(fecha);

  // Insertar en la base de datos
  const sql = `
    INSERT INTO incidencia 
    (id_estudiante, id_personal, fecha, nivel_severidad, motivo, descripcion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    id_estudiante,
    id_personal,
    formattedDate,
    nivel_severidad,
    motivo,
    descripcion,
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error al insertar incidente:", err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    return res.json({ message: 'Incidencia registrado exitosamente' });
  });
};

// 2. Buscar incidencias
export const searchIncidents = (req, res) => {
  const { nivel_severidad, motivo, fecha } = req.query;

  let sql = 'SELECT * FROM incidencia WHERE 1=1';
  const values = [];

  // Filtrar por nivel de severidad
  if (nivel_severidad) {
    sql += ' AND nivel_severidad = ?';
    values.push(nivel_severidad);
  }

  // Filtrar por motivo
  if (motivo) {
    sql += ' AND motivo = ?';
    values.push(motivo);
  }

  // Filtrar por fecha
  if (fecha) {
    if (!isValidDate(fecha)) {
      return res.status(400).json({ message: 'Formato de fecha no válido. Use DD/MM/YYYY' });
    }
    const formattedDate = formatDateForMySQL(fecha);
    sql += ' AND fecha = ?';
    values.push(formattedDate);
  }

  // Ejecutar la consulta
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error al buscar incidencias:", err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    return res.json(results);
  });
};

// 3. Obtener todas las incidencias
export const getAllIncidents = (req, res) => {
  const sql = 'SELECT * FROM incidencia';

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener incidencias:", err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    return res.json(results);
  });
};

// Exportar todas las funciones
export default {
  uploadIncidents,
  searchIncidents,
  getAllIncidents,
};