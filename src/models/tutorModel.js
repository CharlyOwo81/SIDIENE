import db from '../config/db.js';
import bcrypt from 'bcrypt';

class Tutor {
  static async create(tutorData) {
    try {
      await db.query('START TRANSACTION');

      // Insert tutor
      const [result] = await db.query(
        `INSERT INTO tutor SET ?`,
        {
          curp: tutorData.curp,
          nombres: tutorData.nombres,
          apellido_paterno: tutorData.apellido_paterno,
          apellido_materno: tutorData.apellido_materno,
          telefono: tutorData.telefono,
          email: tutorData.email,
          parentesco_id: tutorData.parentesco_id
        }
      );

      // Insert student relationships
      if (tutorData.estudiantes && tutorData.estudiantes.length > 0) {
        const studentRelations = tutorData.estudiantes.map(curp_estudiante => [
          curp_estudiante,
          tutorData.curp
        ]);
        
        await db.query(
          'INSERT INTO estudiantetutor (curp_estudiante, curp_tutor) VALUES ?',
          [studentRelations]
        );
      }

      await db.query('COMMIT');
      return result.insertId;

    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  static async getAll(searchQuery = '', filters = {}) {
    try {
      let sql = `
        SELECT t.*, p.tipo AS parentesco 
        FROM tutor t
        JOIN parentesco p ON t.parentesco_id = p.id
        WHERE 1=1
      `;
      const params = [];

      if (searchQuery) {
        sql += ` AND (
          CONCAT(t.nombres, ' ', t.apellido_paterno, ' ', t.apellido_materno) LIKE ? OR
          t.curp LIKE ?
        )`;
        const searchTerm = `%${searchQuery}%`;
        params.push(searchTerm, searchTerm);
      }

      if (filters.grado) {
        sql += ` AND EXISTS (
          SELECT 1 FROM estudiantetutor et
          JOIN estudiante e ON et.curp_estudiante = e.curp
          WHERE et.curp_tutor = t.curp
          AND e.grado = ?
        )`;
        params.push(filters.grado);
      }

      if (filters.grupo) {
        sql += ` AND EXISTS (
          SELECT 1 FROM estudiantetutor et
          JOIN estudiante e ON et.curp_estudiante = e.curp
          WHERE et.curp_tutor = t.curp
          AND e.grupo = ?
        )`;
        params.push(filters.grupo);
      }

      const [rows] = await db.query(sql, params);
      return rows;

    } catch (error) {
      console.error('Error getting tutors:', error);
      throw error;
    }
  }

  static async getByCurp(curp) {
    try {
      const [rows] = await db.query(`
        SELECT t.*, p.tipo AS parentesco 
        FROM tutor t
        JOIN parentesco p ON t.parentesco_id = p.id
        WHERE t.curp = ?
      `, [curp]);
      
      return rows[0];
    } catch (error) {
      console.error('Error getting tutor:', error);
      throw error;
    }
  }

  static async update(curp, tutorData) {
    try {
      await db.query('START TRANSACTION');

      // Update tutor
      await db.query('UPDATE tutor SET ? WHERE curp = ?', [
        {
          nombres: tutorData.nombres,
          apellido_paterno: tutorData.apellido_paterno,
          apellido_materno: tutorData.apellido_materno,
          telefono: tutorData.telefono,
          email: tutorData.email,
          parentesco_id: tutorData.parentesco_id
        },
        curp
      ]);

      // Update student relationships
      await db.query('DELETE FROM estudiantetutor WHERE curp_tutor = ?', [curp]);
      
      if (tutorData.estudiantes && tutorData.estudiantes.length > 0) {
        const studentRelations = tutorData.estudiantes.map(curp_estudiante => [
          curp_estudiante,
          curp
        ]);
        
        await db.query(
          'INSERT INTO estudiantetutor (curp_estudiante, curp_tutor) VALUES ?',
          [studentRelations]
        );
      }

      await db.query('COMMIT');
      return true;

    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error updating tutor:', error);
      throw error;
    }
  }

  static async delete(curp) {
    try {
      await db.query('START TRANSACTION');
      await db.query('DELETE FROM estudiantetutor WHERE curp_tutor = ?', [curp]);
      await db.query('DELETE FROM tutor WHERE curp = ?', [curp]);
      await db.query('COMMIT');
      return true;
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error deleting tutor:', error);
      throw error;
    }
  }
}

export default Tutor;