import Student from '../models/studentModel.js';

export const createStudent = async (req, res) => {
  try {
    const { curp, nombres, apellidoPaterno, apellidoMaterno, grado, grupo, anio_ingreso } = req.body;

    // Validar que el grado sea uno de los permitidos
    const validGrados = ['1', '2', '3'];
    if (!validGrados.includes(grado)) {
      return res.status(400).json({ error: `Invalid grado value: ${grado}. Allowed values are 1, 2, 3.` });
    }

    // Insertar el estudiante en la base de datos
    const studentId = await Student.create(req.body);
    res.status(201).json({ id: studentId, message: 'Estudiante creado de manera exitosa.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllStudents = async (req, res) => {
  try {
    const { searchQuery, grado, grupo } = req.query;

    let query = `
      SELECT nombres, apellido_paterno, apellido_materno, grado, grupo, curp
      FROM estudiante
      WHERE 1=1
    `;
    const values = [];

    if (searchQuery) {
      query += ` AND (nombres LIKE ? OR apellido_paterno LIKE ? OR apellido_materno LIKE ? OR curp LIKE ? OR grado LIKE ? OR grupo LIKE ? OR anio_ingreso LIKE ?)`;
      values.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (grado) {
      query += ` AND grado IN (${grado.split(',').map(() => '?').join(',')})`;
      values.push(...grado.split(','));
    }

    if (grupo) {
      query += ` AND grupo IN (${grupo.split(',').map(() => '?').join(',')})`;
      values.push(...grupo.split(','));
    }

    console.log('Query:', query);
    console.log('Values:', values);

    const rows = await Student.query(query, values);

    // Formatear los datos para manejar valores null o undefined
    const formattedRows = rows.map(student => ({
      nombres: student.nombres || '', // Si es null o undefined, se asigna una cadena vacía
      apellidoPaterno: student.apellido_paterno || '',
      apellidoMaterno: student.apellido_materno || '',
      grado: student.grado || '',
      grupo: student.grupo || '',
      curp: student.curp || '',
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
};


export const getStudentByCurp = async (req, res) => {
  try {
    const { curp } = req.params;

    const query = `SELECT * FROM estudiante WHERE curp = ?`;
    const rows = await Student.query(query, [curp]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { curp } = req.params;
    const updatedData = req.body;

    // Update the student
    const result = await Student.updateById(curp, updatedData);

    if (!result) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Fetch the updated student data
    const updatedStudent = await Student.getById(curp);

    res.status(200).json({ message: 'Estudiante actualizado con éxito', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const deleteStudent = async (req, res) => {
  try {
    await Student.delete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};