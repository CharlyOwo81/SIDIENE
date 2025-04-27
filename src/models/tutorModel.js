import db from '../config/db.js';

class Tutor {
  static async create(tutorData) {
    try {
      await db.query('START TRANSACTION');

      // Validate parentesco_id
      const [parentesco] = await db.query('SELECT id FROM parentesco WHERE id = ?', [tutorData.parentesco_id]);
      if (!parentesco.length) {
        throw new Error('Parentesco inválido');
      }

      // Insert tutor
      await db.query(
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
      return true;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

// En models/tutorModel.js
static async getAll(searchQuery = '', filters = {}) {
  try {
    let sql = `
      SELECT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN parentesco p ON t.parentesco_id = p.id
      LEFT JOIN estudiantetutor et ON t.curp = et.curp_tutor
      LEFT JOIN estudiante e ON et.curp_estudiante = e.curp
      WHERE 1=1
    `;
    const params = [];

    if (searchQuery) {
      sql += ` AND (
        CONCAT(t.nombres, ' ', t.apellido_paterno) LIKE ? OR
        t.curp LIKE ?
      )`;
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (filters.grado) {
      sql += ' AND e.grado = ?';
      params.push(filters.grado);
    }

    if (filters.grupo) {
      sql += ' AND e.grupo = ?';
      params.push(filters.grupo);
    }

    sql += ' GROUP BY t.curp'; // <- Agregar agrupación

    const [rows] = await db.query(sql, params);
    return rows;
  } catch (error) {
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
      throw error;
    }
  }

  static async update(curp, tutorData) {
    try {
      await db.query('START TRANSACTION');

      // Update tutor
      const [result] = await db.query('UPDATE tutor SET ? WHERE curp = ?', [
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

      if (result.affectedRows === 0) {
        throw new Error('Tutor no encontrado');
      }

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
      throw error;
    }
  }

  static async delete(curp) {
    try {
      await db.query('START TRANSACTION');
      await db.query('DELETE FROM estudiantetutor WHERE curp_tutor = ?', [curp]);
      const [result] = await db.query('DELETE FROM tutor WHERE curp = ?', [curp]);
      await db.query('COMMIT');

      return result.affectedRows > 0;
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

export default Tutor;