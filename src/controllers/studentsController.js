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
    const students = await Student.getAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.getById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    await Student.update(req.params.id, req.body);
    res.status(200).json({ message: 'Student updated successfully' });
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