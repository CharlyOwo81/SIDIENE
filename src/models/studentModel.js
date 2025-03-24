import db from '../config/db.js';

class Student {
  static async query(sql, values) {
    try {
      const [rows] = await db.query(sql, values);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async create(studentData) {
    try {
      console.log('Creando estudiante.');
      const sql = `
        INSERT INTO estudiante (curp, nombres, apellido_paterno, apellido_materno, grado, grupo, anio_ingreso)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        studentData.curp,
        studentData.nombres,
        studentData.apellidoPaterno,
        studentData.apellidoMaterno,
        studentData.grado,
        studentData.grupo,
        studentData.anio_ingreso,
      ];
      const [result] = await db.query(sql, values);
      console.log('Estudiante creado con éxito.');
      return result.insertId;
    } catch (error) {
      console.error('Error en la creación del estudiante.');
      throw error;
    }
  }

  static async getAll() {
    const sql = 'SELECT * FROM estudiante';
    const [rows] = await db.query(sql);
    return rows;
  }

  static async getById(curp) {
    const sql = 'SELECT * FROM estudiante WHERE curp = ?';
    const [rows] = await db.query(sql, [curp]);
    return rows[0]; // Devolver el primer resultado (el estudiante)
  }
  
  static async updateById(curp, updatedData) {
    const sql = `
      UPDATE estudiante
      SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, grado = ?, grupo = ?, anio_ingreso = ?
      WHERE curp = ?
    `;
    const values = [
      updatedData.nombres,
      updatedData.apellidoPaterno,
      updatedData.apellidoMaterno,
      updatedData.grado,
      updatedData.grupo,
      updatedData.anio_ingreso,
      curp,
    ];
  
    await db.query(sql, values);
  
    // Fetch the updated student data
    const [updatedStudent] = await db.query('SELECT * FROM estudiante WHERE curp = ?', [curp]);
    return updatedStudent[0]; // Return the updated student
  }
  static async delete(id) {
    const sql = 'DELETE FROM students WHERE id = ?';
    await db.query(sql, [id]);
  }
}

export default Student;