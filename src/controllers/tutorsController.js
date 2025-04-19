// controllers/tutorController.js
import db from '../config/db.js';
import jsPDF from 'jspdf';
import { sendPDFEmail } from '../services/emailService.js';

export const createTutor = async (req, res) => {
  try {
    const { curp, nombres, apellido_paterno, apellido_materno, telefono, email, parentesco_id, estudiantes } = req.body;
    
    // Validate required fields
    if (!curp || !nombres || !apellido_paterno || !parentesco_id) {
      return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
    }

    await db.query('START TRANSACTION');

    // Insert tutor
    const [result] = await db.query(
      'INSERT INTO tutor SET ?',
      { curp, nombres, apellido_paterno, apellido_materno, telefono, email, parentesco_id }
    );

    // Insert student relationships
    if (estudiantes && estudiantes.length > 0) {
      const studentRelations = estudiantes.map(curp_estudiante => [
        curp_estudiante,
        curp
      ]);
      
      await db.query(
        'INSERT INTO estudiantetutor (curp_estudiante, curp_tutor) VALUES ?',
        [studentRelations]
      );
    }

    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Tutor creado exitosamente',
      data: { curp, nombres, apellido_paterno }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
      `${t.nombres} ${t.apellido_paterno} ${t.apellido_materno}`,
      t.parentesco,
      t.telefono,
      t.email
    ]);

    doc.autoTable({
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 }
    });

    // Save and send
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tutores_${curp}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add updateTutor and deleteTutor similarly
// Add to tutorController.js

export const getAllTutors = async (req, res) => {
    try {
      const [tutors] = await db.query(`
        SELECT t.*, p.tipo AS parentesco 
        FROM tutor t
        JOIN parentesco p ON t.parentesco_id = p.id
      `);
      
      res.json({
        success: true,
        data: tutors,
        count: tutors.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const updateTutor = async (req, res) => {
    try {
      const { curp } = req.params;
      const updateData = req.body;
  
      await db.query('START TRANSACTION');
  
      // Update tutor
      await db.query('UPDATE tutor SET ? WHERE curp = ?', [updateData, curp]);
  
      // Update student relationships
      if (updateData.estudiantes) {
        await db.query('DELETE FROM estudiantetutor WHERE curp_tutor = ?', [curp]);
        
        const studentRelations = updateData.estudiantes.map(curp_estudiante => [
          curp_estudiante,
          curp
        ]);
        
        await db.query(
          'INSERT INTO estudiantetutor (curp_estudiante, curp_tutor) VALUES ?',
          [studentRelations]
        );
      }
  
      await db.query('COMMIT');
  
      res.json({
        success: true,
        message: 'Tutor actualizado exitosamente'
      });
  
    } catch (error) {
      await db.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const deleteTutor = async (req, res) => {
    try {
      const { curp } = req.params;
  
      await db.query('START TRANSACTION');
      await db.query('DELETE FROM estudiantetutor WHERE curp_tutor = ?', [curp]);
      await db.query('DELETE FROM tutor WHERE curp = ?', [curp]);
      await db.query('COMMIT');
  
      res.json({
        success: true,
        message: 'Tutor eliminado exitosamente'
      });
  
    } catch (error) {
      await db.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    }
  };