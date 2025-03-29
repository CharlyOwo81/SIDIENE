import db from '../config/db.js';

class Student {
  static async bulkCreate(studentsData) {
    try {
      if (!studentsData || studentsData.length === 0) {
        console.error('No student data provided for bulk insert');
        return { created: 0, updated: 0 }; // Return empty result instead of throwing
      }
  
      const sql = `
        INSERT INTO estudiante 
          (curp, nombres, apellido_paterno, apellido_materno, grado, grupo, anio_ingreso)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          nombres = VALUES(nombres),
          apellido_paterno = VALUES(apellido_paterno),
          apellido_materno = VALUES(apellido_materno),
          grado = VALUES(grado),
          grupo = VALUES(grupo),
          anio_ingreso = VALUES(anio_ingreso)
      `;
      
      // Map to database column names (apellido_paterno instead of apellidoPaterno)
      const values = studentsData.map(student => [
        student.curp,
        student.nombres,
        student.apellidoPaterno,
        student.apellidoMaterno,
        student.grado,
        student.grupo,
        student.anio_ingreso
      ]);
  
      console.log('Executing bulk insert with:', { 
        studentCount: values.length,
        sampleStudent: values[0] 
      });
  
      const [result] = await db.query(sql, [values]);
      return {
        created: result.affectedRows - result.changedRows, // Actual new inserts
        updated: result.changedRows
      };
    } catch (error) {
      console.error('Error in bulk student creation:', error);
      throw error;
    }
  }

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
  
// In your Student model
static async updateById(curp, updatedData) {
  const sql = `
    UPDATE estudiante
    SET 
      nombres = ?,
      apellido_paterno = ?,
      apellido_materno = ?,
      grado = ?,
      grupo = ?,
      anio_ingreso = ?,
      estatus = ?
    WHERE curp = ?
  `;
  
  const values = [
    updatedData.nombres,
    updatedData.apellidoPaterno,
    updatedData.apellidoMaterno,
    updatedData.grado,
    updatedData.grupo,
    updatedData.anio_ingreso,
    updatedData.estatus,
    curp
  ];

  await db.query(sql, values);

  // Return the updated student
  const [updated] = await db.query('SELECT * FROM estudiante WHERE curp = ?', [curp]);
  return updated[0];
}

  static async delete(id) {
    const sql = 'DELETE FROM students WHERE id = ?';
    await db.query(sql, [id]);
  }
}

export default Student;