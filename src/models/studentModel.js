import db from '../config/db.js';

class Student {
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
    const sql = 'SELECT * FROM students';
    const [rows] = await db.query(sql);
    return rows;
  }

  static async getById(id) {
    const sql = 'SELECT * FROM students WHERE curp = ?';
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  }

  static async update(id, studentData) {
    const sql = `
      UPDATE students
      SET curp = ?, nombres = ?, apellidoPaterno = ?, apellidoMaterno = ?, grado = ?, grupo = ?, anio_ingreso = ?
      WHERE curp = ?
    `;
    const values = [
      studentData.curp,
      studentData.nombres,
      studentData.apellidoPaterno,
      studentData.apellidoMaterno,
      studentData.grado,
      studentData.grupo,
      studentData.anio_ingreso,
      id,
    ];

    await db.query(sql, values);
  }

  static async delete(id) {
    const sql = 'DELETE FROM students WHERE id = ?';
    await db.query(sql, [id]);
  }
}

export default Student;