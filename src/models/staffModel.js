// models/Staff.js
import db from '../config/db.js';
import bcrypt from 'bcrypt';

class Staff {  
  static async create(staffData) {
  try {
    console.log('Creando miembro del personal.');

    // Asignar la contraseña según el rol
    let contrasenia;
    switch (staffData.rol) {
      case 'DIRECTIVO':
        contrasenia = process.env.DIRECTIVO_PASSWORD;
        break;
      case 'PREFECTO':
        contrasenia = process.env.PREFECTO_PASSWORD;
        break;
      case 'DOCENTE':
        contrasenia = process.env.DOCENTE_PASSWORD;
        break;
      case 'TRABAJADOR SOCIAL':
        contrasenia = process.env.TRABAJADOR_SOCIAL_PASSWORD;
        break;
      default:
        throw new Error('Rol no válido.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10); // 10 es el costo del hasheo

    // Insertar el miembro del personal en la base de datos
    const sql = `
      INSERT INTO personal (curp, nombres, apellido_paterno, apellido_materno, telefono, rol, contrasenia)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      staffData.curp,
      staffData.nombre,
      staffData.apellidoPaterno,
      staffData.apellidoMaterno,
      staffData.telefono,
      staffData.rol,
      hashedPassword, // Contraseña hasheada
    ];
    const [result] = await db.query(sql, values);
    console.log('Miembro del personal creado con éxito.');
    return result.insertId;
  } catch (error) {
    console.error('Error en la creación del miembro del personal:', error);
    throw error;
  }
}

// models/Staff.js - Fixed getAll method
static async getAll(searchQuery = '', filters = {}) {
  try {
    let sql = 'SELECT * FROM personal WHERE 1=1';
    const params = [];

    // Fixed search query handling
    if (searchQuery) {
      sql += ` AND (
        nombres LIKE ? OR 
        apellido_paterno LIKE ? OR 
        apellido_materno LIKE ? OR 
        curp LIKE ?
      )`;
      const searchTerm = `%${searchQuery}%`;
      // Add 4 parameters for the 4 placeholders
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Fixed filter handling
    if (filters.rol?.length > 0) {
      sql += ` AND rol IN (${filters.rol.map(() => '?').join(',')})`;
      params.push(...filters.rol);
    }

    console.log('Final SQL:', sql);
    console.log('Params:', params);

    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}
  static async getById(id) {
    try {
      const sql = 'SELECT * FROM personal WHERE curp = ?';
      const [rows] = await db.query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener el miembro del personal por ID:', error);
      throw error;
    }
  }

  static async update(id, staffData) {
    try {
      const sql = `
        UPDATE staff
        SET curp = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ?, rol = ?
        WHERE curp = ?
      `;
      const values = [
        staffData.curp,
        staffData.nombre,
        staffData.apellidoPaterno,
        staffData.apellidoMaterno,
        staffData.telefono,
        staffData.rol,
        id,
      ];
      await db.query(sql, values);
      console.log('Miembro del personal actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el miembro del personal:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const sql = 'DELETE FROM personal WHERE curp = ?';
      await db.query(sql, [id]);
      console.log('Miembro del personal eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el miembro del personal:', error);
      throw error;
    }
  }
}

export default Staff;