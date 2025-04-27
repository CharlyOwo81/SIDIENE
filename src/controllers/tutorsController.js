import Tutor from '../models/tutorModel.js'; // Import the Tutor model
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable for jsPDF
import pdfParse from 'pdf-parse'; // For parsing PDFs
import db from '../config/db.js';

// Create a new tutor
export const createTutor = async (req, res) => {
  try {
    const { curp, nombres, apellido_paterno, apellido_materno, telefono, email, parentesco_id, estudiantes } = req.body;

    // Validate required fields
    if (!curp || !nombres || !apellido_paterno || !parentesco_id || !telefono) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
    }

    // Validate parentesco_id exists
    const [parentesco] = await db.query('SELECT id FROM parentesco WHERE id = ?', [parentesco_id]);
    if (!parentesco.length) {
      return res.status(400).json({ success: false, message: 'Parentesco inválido' });
    }

    // Validate estudiantes (if provided)
    if (estudiantes && estudiantes.length > 0) {
      const [students] = await db.query('SELECT curp FROM estudiante WHERE curp IN (?)', [estudiantes]);
      if (students.length !== estudiantes.length) {
        return res.status(400).json({ success: false, message: 'Uno o más estudiantes no existen' });
      }
    }

    const tutorData = {
      curp,
      nombres,
      apellido_paterno,
      apellido_materno,
      telefono,
      email,
      parentesco_id,
      estudiantes
    };

    await Tutor.create(tutorData);

    res.status(201).json({
      success: true,
      message: 'Tutor creado exitosamente',
      data: { curp, nombres, apellido_paterno }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'El CURP ya está registrado' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Get all tutors with search and filters
export const getAllTutors = async (req, res) => {
  try {
    const { searchQuery, grado, grupo } = req.query;

    const filters = {
      grado: grado ? grado.split(',') : [],
      grupo: grupo ? grupo.split(',') : []
    };

    const tutors = await Tutor.getAll(searchQuery || '', filters);

    res.json({
      success: true,
      data: tutors,
      count: tutors.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tutors by student CURP
export const getTutorsByStudent = async (req, res) => {
  try {
    const { curp } = req.params;

    const [results] = await db.query(`
      SELECT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN estudiantetutor et ON t.curp = et.curp_tutor
      JOIN parentesco p ON t.parentesco_id = p.id
      WHERE et.curp_estudiante = ?
    `, [curp]);

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a tutor
export const updateTutor = async (req, res) => {
  try {
    const { curp } = req.params;
    const { nombres, apellido_paterno, apellido_materno, telefono, email, parentesco_id, estudiantes } = req.body;

    // Validate parentesco_id exists
    if (parentesco_id) {
      const [parentesco] = await db.query('SELECT id FROM parentesco WHERE id = ?', [parentesco_id]);
      if (!parentesco.length) {
        return res.status(400).json({ success: false, message: 'Parentesco inválido' });
      }
    }

    // Validate estudiantes (if provided)
    if (estudiantes && estudiantes.length > 0) {
      const [students] = await db.query('SELECT curp FROM estudiante WHERE curp IN (?)', [estudiantes]);
      if (students.length !== estudiantes.length) {
        return res.status(400).json({ success: false, message: 'Uno o más estudiantes no existen' });
      }
    }

    const tutorData = {
      nombres,
      apellido_paterno,
      apellido_materno,
      telefono,
      email,
      parentesco_id,
      estudiantes
    };

    const updated = await Tutor.update(curp, tutorData);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Tutor no encontrado' });
    }

    res.json({
      success: true,
      message: 'Tutor actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a tutor
export const deleteTutor = async (req, res) => {
  try {
    const { curp } = req.params;

    const deleted = await Tutor.delete(curp);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Tutor no encontrado' });
    }

    res.json({
      success: true,
      message: 'Tutor eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export student tutors as PDF
export const exportStudentTutorsPDF = async (req, res) => {
  try {
    const { curp } = req.params;

    // Get student information
    const [student] = await db.query(`
      SELECT CONCAT(nombres, ' ', apellido_paterno, ' ', apellido_materno) AS nombre_completo,
             grado, grupo 
      FROM estudiante 
      WHERE curp = ?
    `, [curp]);

    if (!student.length) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }

    // Get tutors
    const [tutors] = await db.query(`
      SELECT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN estudiantetutor et ON t.curp = et.curp_tutor
      JOIN parentesco p ON t.parentesco_id = p.id
      WHERE et.curp_estudiante = ?
    `, [curp]);

    // Generate PDF
    const doc = new jsPDF();

    // Add student info
    doc.setFontSize(16);
    doc.text(`Tutores de: ${student[0].nombre_completo}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Grado: ${student[0].grado} | Grupo: ${student[0].grupo}`, 20, 30);

    // Add tutors table
    const headers = [['Nombre', 'Parentesco', 'Teléfono', 'Email']];
    const data = tutors.map(t => [
      `${t.nombres} ${t.apellido_paterno} ${t.apellido_materno || ''}`,
      t.parentesco,
      t.telefono || 'N/A',
      t.email || 'N/A'
    ]);

    doc.autoTable({
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 }
    });

    // Send PDF as response
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tutores_${curp}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload tutors from PDF
export const uploadTutorsFromPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se proporcionó un archivo PDF' });
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    // Simple parsing logic (assumes a structured format in the PDF)
    // Example format in PDF: "CURP: XXXX, Nombres: YYYY, Apellido Paterno: ZZZZ, ..."
    const tutors = [];
    const lines = text.split('\n');
    let currentTutor = {};

    for (const line of lines) {
      if (line.includes('CURP:')) {
        if (Object.keys(currentTutor).length > 0) {
          tutors.push(currentTutor);
          currentTutor = {};
        }
        const curp = line.split('CURP:')[1]?.trim().split(',')[0];
        currentTutor.curp = curp;
      } else if (line.includes('Nombres:')) {
        currentTutor.nombres = line.split('Nombres:')[1]?.trim().split(',')[0];
      } else if (line.includes('Apellido Paterno:')) {
        currentTutor.apellido_paterno = line.split('Apellido Paterno:')[1]?.trim().split(',')[0];
      } else if (line.includes('Apellido Materno:')) {
        currentTutor.apellido_materno = line.split('Apellido Materno:')[1]?.trim().split(',')[0];
      } else if (line.includes('Teléfono:')) {
        currentTutor.telefono = line.split('Teléfono:')[1]?.trim().split(',')[0];
      } else if (line.includes('Email:')) {
        currentTutor.email = line.split('Email:')[1]?.trim().split(',')[0];
      } else if (line.includes('Parentesco:')) {
        const parentescoTipo = line.split('Parentesco:')[1]?.trim().split(',')[0];
        const [parentesco] = await db.query('SELECT id FROM parentesco WHERE tipo = ?', [parentescoTipo]);
        currentTutor.parentesco_id = parentesco[0]?.id || 1; // Default to "Padre" if not found
      } else if (line.includes('Estudiantes:')) {
        const estudiantes = line.split('Estudiantes:')[1]?.trim().split(',').map(s => s.trim());
        currentTutor.estudiantes = estudiantes;
      }
    }

    if (Object.keys(currentTutor).length > 0) {
      tutors.push(currentTutor);
    }

    // Insert tutors into the database
    for (const tutor of tutors) {
      await Tutor.create(tutor);
    }

    res.json({
      success: true,
      message: `Se registraron ${tutors.length} tutores exitosamente`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};