// models/Expediente.js
import db from "../config/db.js";

class Expediente {
  static async create(newExpediente) {
    try {
      const [result] = await db.query("INSERT INTO expediente SET ?", {
        id_estudiante: newExpediente.id_estudiante,
      });
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async createBulkIncidencias(idExpediente, incidencias) {
    try {
      const query = `
        INSERT INTO expediente_incidencia (id_expediente, id_incidencia)
        VALUES ?
      `;
      const values = incidencias.map((inc) => [
        idExpediente,
        inc.id_incidencia,
      ]);
      const [result] = await db.query(query, [values]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findOne(conditions) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM expediente WHERE ? LIMIT 1",
        [conditions]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

// En models/Expediente.js
static async getByStudent(idEstudiante) {
  try {
    const [rows] = await db.query(
      `
      SELECT e.id_expediente, e.fecha_creacion, e.id_estudiante,
             i.id_incidencia, i.motivo, i.fecha, i.descripcion, i.nivel_severidad,
             a.id_acuerdo, a.descripcion AS acuerdo_desc, a.estatus, a.fecha_creacion AS acuerdo_fecha
      FROM expediente e
      LEFT JOIN incidencia i ON e.id_estudiante = i.id_estudiante
      LEFT JOIN acuerdo a ON i.id_incidencia = a.id_incidencia
      WHERE e.id_estudiante = ?
      ORDER BY i.fecha DESC, a.fecha_creacion ASC
      `,
      [idEstudiante]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

  static async addAcuerdo(idIncidencia, acuerdoData) {
    try {
      const [acuerdo] = await db.query(
        `INSERT INTO acuerdo 
      (descripcion, estatus, fecha_creacion, id_incidencia) 
      VALUES (?, ?, ?, ?)`,
        [
          acuerdoData.descripcion,
          acuerdoData.estatus, // ← Campo agregado
          acuerdoData.fecha_creacion,
          idIncidencia,
        ]
      );
      return acuerdo.insertId;
    } catch (error) {
      throw error;
    }
  }
}

export default Expediente;
