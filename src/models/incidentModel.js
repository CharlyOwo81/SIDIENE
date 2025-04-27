import db from '../config/db.js';

class Incident {
  static async create(incidentData) {
    try {
      const [result] = await db.query(
        `INSERT INTO incidencia SET ?`,
        [incidentData]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating incident: ${error.message}`);
    }
  }

// En models/incidentModel.js
// models/incidentModel.js
// models/incidentModel.js
static async getAll() {
  try {
    const sql = `
      SELECT 
        i.id_incidencia,
        DATE_FORMAT(i.fecha, '%Y-%m-%d') as fecha,
        i.nivel_severidad,
        i.motivo,
        i.descripcion,
        i.estado,
        e.curp AS curp_estudiante,
        CONCAT(e.nombres, ' ', e.apellido_paterno, ' ', e.apellido_materno) AS nombre_estudiante,
        e.grado,
        e.grupo,
        CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_personal,
        GROUP_CONCAT(DISTINCT CONCAT(t.nombres, ' ', t.apellido_paterno)) AS tutores
      FROM incidencia i
      JOIN estudiante e ON i.id_estudiante = e.curp
      JOIN personal p ON i.id_personal = p.curp
      LEFT JOIN estudiantetutor et ON e.curp = et.curp_estudiante
      LEFT JOIN tutor t ON et.curp_tutor = t.curp
      GROUP BY i.id_incidencia
    `;

    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    console.error('Error en getAll:', error);
    throw error;
  }
}

  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT *, estado FROM incidencia WHERE id_incidencia = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching incident: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const [result] = await db.query(
        `UPDATE incidencia SET ? WHERE id_incidencia = ?`,
        [updateData, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating incident: ${error.message}`);
    }
  }

  static async getByStudent(curp) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM incidencia 
         WHERE curp_estudiante = ? 
         ORDER BY fecha DESC`,
        [curp]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error getting incidents: ${error.message}`);
    }
  }

  static async getByFilters(filters) {
    try {
      let sql = `
        SELECT 
          i.id_incidencia,
          DATE_FORMAT(i.fecha, '%Y-%m-%d') as fecha,
          i.nivel_severidad,
          i.motivo,
          i.descripcion,
          i.estado,
          e.curp AS curp_estudiante,
          CONCAT(e.nombres, ' ', e.apellido_paterno) AS nombre_estudiante,
          e.grado,
          e.grupo,
          CONCAT(p.nombres, ' ', p.apellido_paterno) AS nombre_personal,
          GROUP_CONCAT(DISTINCT t.telefono, '|', t.email) AS contactos_tutores
        FROM incidencia i
        JOIN estudiante e ON i.id_estudiante = e.curp
        JOIN personal p ON i.id_personal = p.curp
        LEFT JOIN estudiantetutor et ON e.curp = et.curp_estudiante
        LEFT JOIN tutor t ON et.curp_tutor = t.curp
      `;
  
      const whereClauses = [];
      const params = [];
  
      if (filters.fecha) {
        whereClauses.push('i.fecha = ?');
        params.push(filters.fecha);
      }
      
      if (filters.nombre) {
        whereClauses.push('CONCAT(e.nombres, " ", e.apellido_paterno) LIKE ?');
        params.push(`%${filters.nombre}%`);
      }
      
      if (filters.severidad) {
        whereClauses.push('i.nivel_severidad = ?');
        params.push(filters.severidad);
      }
  
      if (whereClauses.length > 0) {
        sql += ' WHERE ' + whereClauses.join(' AND ');
      }
  
      sql += ' GROUP BY i.id_incidencia ORDER BY i.fecha DESC';
  
      const [rows] = await db.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error en getByFilters:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM incidencia WHERE id_incidencia = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting incident: ${error.message}`);
    }
  }
}

export default Incident;