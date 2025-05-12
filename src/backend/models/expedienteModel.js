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

  static async getByStudent(idEstudiante) {
    try {
      const [rows] = await db.query(
        `
        SELECT e.id_expediente, e.fecha_creacion, e.id_estudiante,
               i.id_incidencia, i.motivo, i.fecha, i.descripcion, i.nivel_severidad, i.estado,
               a.id_acuerdo, a.descripcion AS acuerdo_desc, a.estatus, a.fecha_creacion AS acuerdo_fecha,
               s.curp, s.nombres, s.apellido_paterno, s.apellido_materno, s.grado, s.grupo
        FROM expediente e
        LEFT JOIN incidencia i ON e.id_estudiante = i.id_estudiante
        LEFT JOIN acuerdo a ON i.id_incidencia = a.id_incidencia
        LEFT JOIN estudiante s ON e.id_estudiante = s.curp
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

  static async getStudentsWithExpediente(grado, grupo) {
    try {
      const [rows] = await db.query(
        `
        SELECT DISTINCT s.curp, s.nombres, s.apellido_paterno, s.apellido_materno, s.grado, s.grupo,
               COUNT(e.id_expediente) as expediente_count
        FROM estudiante s
        LEFT JOIN expediente e ON s.curp = e.id_estudiante
        WHERE s.grado = ? AND s.grupo = ?
        GROUP BY s.curp, s.nombres, s.apellido_paterno, s.apellido_materno, s.grado, s.grupo
        `,
        [grado, grupo]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async addAcuerdo(idIncidencia, acuerdoData) {
    try {
      // Validar que estatus sea un valor permitido
      const validEstatus = ['ABIERTO', 'EN PROCESO', 'COMPLETADO'];
      if (!validEstatus.includes(acuerdoData.estatus)) {
        throw new Error('Estatus inválido para el acuerdo');
      }

      const [acuerdo] = await db.query(
        `INSERT INTO acuerdo 
        (descripcion, estatus, fecha_creacion, id_incidencia) 
        VALUES (?, ?, ?, ?)`,
        [
          acuerdoData.descripcion,
          acuerdoData.estatus,
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