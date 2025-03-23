import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Load passwords from environment variables
const contraseñasPorRol = {
  DIRECTIVO: process.env.DIRECTIVO_PASSWORD,
  PREFECTO: process.env.PREFECTO_PASSWORD,
  DOCENTE: process.env.DOCENTE_PASSWORD,
  TRABAJADOR_SOCIAL: process.env.TRABAJADOR_SOCIAL_PASSWORD,
};

// Helper function to promisify db.query
const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// CREATE: Add a new staff member
export const addStaff = async (req, res) => {
  const { curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol } = req.body;

  if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const contrasenia = contraseñasPorRol[rol];
    if (!contrasenia) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const sql = `
      INSERT INTO personal (curp, nombres, apellido_paterno, apellido_materno, telefono, rol, contrasenia)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol, hashedPassword];

    const results = await queryAsync(sql, values);

    return res.json({
      message: 'Personal registrado exitosamente',
      contrasenia, // Avoid sending this in production
      rol,
      id: results.insertId, // Return the new staff member's ID
    });
  } catch (error) {
    console.error('Error en addStaff:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// READ: Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const sql = 'SELECT id, curp, nombres, apellido_paterno, apellido_materno, telefono, rol FROM personal';
    const results = await queryAsync(sql);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros' });
    }

    return res.json({ message: 'Personal recuperado exitosamente', staff: results });
  } catch (error) {
    console.error('Error en getAllStaff:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// READ: Get a single staff member by ID
export const getStaffById = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'SELECT id, curp, nombres, apellido_paterno, apellido_materno, telefono, rol FROM personal WHERE id = ?';
    const results = await queryAsync(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Personal no encontrado' });
    }

    return res.json({ message: 'Personal encontrado', staff: results[0] });
  } catch (error) {
    console.error('Error en getStaffById:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// UPDATE: Edit a staff member
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol } = req.body;

  if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const contrasenia = contraseñasPorRol[rol];
    if (!contrasenia) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const sql = `
      UPDATE personal 
      SET curp = ?, nombres = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ?, rol = ?, contrasenia = ?
      WHERE id = ?
    `;
    const values = [curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol, hashedPassword, id];

    const results = await queryAsync(sql, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Personal no encontrado' });
    }

    return res.json({ message: 'Personal actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateStaff:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// DELETE: Remove a staff member
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM personal WHERE id = ?';
    const results = await queryAsync(sql, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Personal no encontrado' });
    }

    return res.json({ message: 'Personal eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteStaff:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};