import db from '../config/db.js';

class Incident {

  static async create(incidentData) {
    try {
      const sql = `
        INSERT INTO incidencia
        (id_estudiante, id_personal, fecha, nivel_severidad, motivo, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        incidentData.id_estudiante, // Cambiar nombre de campo
        incidentData.id_personal,   // Cambiar nombre de campo
        new Date(incidentData.fecha),
        incidentData.nivel_severidad, 
        incidentData.motivo,
        incidentData.descripcion
      ];
  
      const [result] = await db.query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const sql = `
      SELECT 
        i.id_incidencia,
        i.fecha,
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
      console.error('Error fetching incidents:', error);
      throw error;
    }
  }
}


export default Incident;