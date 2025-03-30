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
}

export default Incident;