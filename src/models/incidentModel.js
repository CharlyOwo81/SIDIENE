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
static async getAll() {
  try {
    const sql = `
      SELECT 
        i.id_incidencia,
        DATE_FORMAT(i.fecha, '%Y-%m-%d') as fecha,
        i.nivel_severidad,
        i.motivo,
        i.descripcion,
        e.curp AS curp_estudiante,
        CONCAT(e.nombres, ' ', e.apellido_paterno, ' ', e.apellido_materno) AS nombre_estudiante,
        e.grado,
        e.grupo,
        CONCAT(p.nombres, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_personal
      FROM incidencia i
      JOIN estudiante e ON i.id_estudiante = e.curp
      JOIN personal p ON i.id_personal = p.curp
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
        `SELECT * FROM incidencia WHERE id_incidencia = ?`,
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