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
      staffData.estatus,
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

static async getAll(searchQuery = '', filters = {}) {
  try{
    let sql = 
    `SELECT 
    curp, 
    nombres, 
    apellido_paterno as apellidoPaterno, 
    apellido_materno as apellidoMaterno, 
    rol 
    FROM personal 
    WHERE 1=1`;
  
    const params = [];

    //Búsqueda con columnas exactas
    if (searchQuery) {
      sql += ` AND (
        CONCAT(nombres, ' ', apellido_paterno, ' ', apellido_materno) LIKE ? OR
        curp LIKE ?
      )`;
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm, searchTerm);
    }

        // Fixed array filter handling
        if (filters.rol?.length > 0) {
          sql += ` AND rol IN (?)`; // MySQL requires array wrapping
          params.push([filters.rol]);
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

// models/Staff.js
static async update(curp, staffData) {
  try {
    const sql = `
      UPDATE personal
      SET 
        nombres = ?, 
        apellido_paterno = ?, 
        apellido_materno = ?, 
        rol = ?,
        estatus = ?
      WHERE curp = ?
    `;
    const values = [
      staffData.nombres,
      staffData.apellidoPaterno,
      staffData.apellidoMaterno,
      staffData.rol,
      staffData.estatus,
      curp // Original CURP from URL parameter
    ];

    console.log('Executing update with:', { sql, values });
    
    await db.query(sql, values);
    console.log('Miembro del personal actualizado con éxito.');
    
    // Return updated staff data
    return this.getById(curp);
  } catch (error) {
    console.error('Update error:', error);
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