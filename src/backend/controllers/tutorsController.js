import Tutor from "../models/tutorModel.js"; // Import the Tutor model
import {jsPDF} from "jspdf";
import "jspdf-autotable"; // Import autoTable for jsPDF
import pdfParse from "pdf-parse"; // For parsing PDFs
import db from "../config/db.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Load images as base64 (replace with actual base64 strings if available)
let tecnica56Logo, sonoraLogo;
try {
  const tecnica56Path = path.resolve('public/tecnica56Logo.png');
  const sonoraLogoPath = path.resolve('public/sonoraLogo.png');
  tecnica56Logo = `data:image/png;base64,${fs.readFileSync(tecnica56Path, 'base64')}`;
  sonoraLogo = `data:image/png;base64,${fs.readFileSync(sonoraLogoPath, 'base64')}`;
} catch (error) {
  console.error('Error loading logos:', error);
  // Fallback placeholders (optional)
  tecnica56Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAH8wInb5xUAAAAAElFTkSuQmCC';
  sonoraLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAH8wInb5xUAAAAAElFTkSuQmCC';
}

// Create a new tutor
export const createTutor = async (req, res) => {
  try {
    const {
      curp,
      nombres,
      apellido_paterno,
      apellido_materno,
      telefono,
      email,
      parentesco_id,
      estudiantes,
    } = req.body;

    // Validate required fields
    if (!curp || !nombres || !apellido_paterno || !parentesco_id || !telefono) {
      return res
        .status(400)
        .json({ success: false, message: "Campos requeridos faltantes" });
    }

    // Validate parentesco_id exists
    const [parentesco] = await db.query(
      "SELECT id FROM parentesco WHERE id = ?",
      [parentesco_id]
    );
    if (!parentesco.length) {
      return res
        .status(400)
        .json({ success: false, message: "Parentesco inválido" });
    }

    // Validate estudiantes (if provided)
    if (estudiantes && estudiantes.length > 0) {
      const [students] = await db.query(
        "SELECT curp FROM estudiante WHERE curp IN (?)",
        [estudiantes]
      );
      if (students.length !== estudiantes.length) {
        return res.status(400).json({
          success: false,
          message: "Uno o más estudiantes no existen",
        });
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
      estudiantes,
    };

    await Tutor.create(tutorData);

    res.status(201).json({
      success: true,
      message: "Tutor creado exitosamente",
      data: { curp, nombres, apellido_paterno },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ success: false, message: "El CURP ya está registrado" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Get all tutors with search and filters
// Modificar la función getAllTutors
// In tutorController.js (or wherever your routes are defined)

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT curp, nombres, apellido_paterno, apellido_materno
      FROM estudiante
    `);
    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTutors = async (req, res) => {
  try {
    const { searchQuery, grado, grupo, curpEstudiante } = req.query;

    let query = `
      SELECT DISTINCT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN parentesco p ON t.parentesco_id = p.id
      LEFT JOIN estudiantetutor et ON t.curp = et.curp_tutor
      LEFT JOIN estudiante e ON et.curp_estudiante = e.curp
      WHERE 1=1
    `;

    const params = [];

    if (curpEstudiante) {
      query += " AND et.curp_estudiante = ?";
      params.push(curpEstudiante);
    } else {
      if (searchQuery) {
        query +=
          ' AND (CONCAT(t.nombres, " ", t.apellido_paterno) LIKE ? OR t.curp LIKE ?)';
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
      }
      if (grado) {
        query += " AND e.grado = ?";
        params.push(grado);
      }
      if (grupo) {
        query += " AND e.grupo = ?";
        params.push(grupo);
      }
    }

    const [results] = await db.query(query, params);

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get students associated with a tutor
export const getTutorsStudents = async (req, res) => {
  try {
    const { curp } = req.params;
    const [results] = await db.query(
      ` SELECT e.curp, e.nombres, 
      e.apellido_paterno AS apellidoPaterno,
       e.apellido_materno AS apellidoMaterno, 
       e.grado, 
       e.grupo 
       FROM estudiante e 
       JOIN estudiantetutor et 
       ON e.curp = et.curp_estudiante 
       WHERE et.curp_tutor = ? `,
      [curp]
    );
    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tutors by student CURP

export const getTutorsByStudent = async (req, res) => {
  try {
    const { curp } = req.params;

    const [results] = await db.query(
      `
      SELECT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN estudiantetutor et ON t.curp = et.curp_tutor
      JOIN parentesco p ON t.parentesco_id = p.id
      WHERE et.curp_estudiante = ?
    `,
      [curp]
    );

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a tutor
export const updateTutor = async (req, res) => {
  try {
    const { curp } = req.params;
    const {
      nombres,
      apellido_paterno,
      apellido_materno,
      telefono,
      email,
      parentesco_id,
      estudiantes,
    } = req.body;

    // Validate required fields
    if (!telefono || !parentesco_id) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: telefono, parentesco_id",
      });
    }

    // Validate parentesco_id exists
    const [parentesco] = await db.query(
      "SELECT id FROM parentesco WHERE id = ?",
      [parentesco_id]
    );
    if (!parentesco.length) {
      return res
        .status(400)
        .json({ success: false, message: "Parentesco inválido" });
    }

    // Validate estudiantes (if provided)
    if (estudiantes && estudiantes.length > 0) {
      const [students] = await db.query(
        "SELECT curp FROM estudiante WHERE curp IN (?)",
        [estudiantes]
      );
      if (students.length !== estudiantes.length) {
        return res.status(400).json({
          success: false,
          message: "Uno o más estudiantes no existen",
        });
      }
    }

    const tutorData = {
      nombres: nombres || null,
      apellido_paterno: apellido_paterno || null,
      apellido_materno: apellido_materno || null,
      telefono,
      email: email || null,
      parentesco_id,
      estudiantes: estudiantes || [],
    };

    const updated = await Tutor.update(curp, tutorData);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Tutor no encontrado" });
    }

    const updatedTutor = await Tutor.getByCurp(curp);
    res.json({
      success: true,
      message: "Tutor actualizado exitosamente",
      data: updatedTutor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
};

export const getParentesco = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, tipo FROM parentesco");
    res.json({ success: true, data: results, count: results.length });
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
      return res
        .status(404)
        .json({ success: false, message: "Tutor no encontrado" });
    }

    res.json({
      success: true,
      message: "Tutor eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportStudentTutorsPDF = async (req, res) => {
  try {
    const { studentCurp } = req.query;

    if (!studentCurp) {
      return res.status(400).json({ success: false, message: 'Se requiere CURP del estudiante' });
    }

    // Get student information
    const [student] = await db.query(
      `
      SELECT CONCAT(nombres, ' ', apellido_paterno, ' ', COALESCE(apellido_materno, '')) AS nombre_completo,
             grado, grupo 
      FROM estudiante 
      WHERE curp = ?
    `,
      [studentCurp]
    );

    if (!student.length) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }

    // Get tutors
    const [tutors] = await db.query(
      `
      SELECT t.*, p.tipo AS parentesco 
      FROM tutor t
      JOIN estudiantetutor et ON t.curp = et.curp_tutor
      JOIN parentesco p ON t.parentesco_id = p.id
      WHERE et.curp_estudiante = ?
    `,
      [studentCurp]
    );

    console.log('Fetched student:', student[0]);
    console.log('Fetched tutors:', tutors);

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 15;
    let yPosition = margin;
    const pageWidth = 210;
    const logoLeftWidth = 28;
    const logoRightWidth = 28;

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const colors = {
      yellow: '#F3C44D',
      orange: '#E5823E',
      redOrange: '#C26444',
      deepPink: '#891547',
    };

    // Header
    doc.addImage(tecnica56Logo, 'PNG', margin, yPosition, logoLeftWidth, 18);
    const logoRightX = pageWidth - margin - logoRightWidth;
    doc.addImage(sonoraLogo, 'PNG', logoRightX, yPosition, logoRightWidth, 14);

    const textStartX = margin + logoLeftWidth + 5;
    const textAvailableWidth = pageWidth - (2 * margin) - logoLeftWidth - logoRightWidth - 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const titleText = 'ESCUELA SECUNDARIA TÉCNICA NO. 56';
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = textStartX + (textAvailableWidth - titleWidth) / 2;
    doc.text(titleText, titleX, yPosition + 10);

    doc.setFontSize(14);
    const schoolName = "'JOSÉ LUIS OSUNA VILLA'";
    const schoolWidth = doc.getTextWidth(schoolName);
    const schoolX = textStartX + (textAvailableWidth - schoolWidth) / 2;
    doc.text(schoolName, schoolX, yPosition + 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const subtitleText = 'Sistema de Digitalización de Expedientes e Incidencias para la Nueva Escuela';
    const subtitleLines = doc.splitTextToSize(subtitleText, textAvailableWidth);
    const subtitleY = yPosition + 26;
    subtitleLines.forEach((line, index) => {
      const lineWidth = doc.getTextWidth(line);
      const lineX = textStartX + (textAvailableWidth - lineWidth) / 2;
      doc.text(line, lineX, subtitleY + index * 7);
    });

    const dateY = subtitleY + subtitleLines.length * 7 + 6;
    const dateText = `PDF generado: ${new Date().toLocaleDateString('es-MX')}`;
    const dateWidth = doc.getTextWidth(dateText);
    const dateX = textStartX + (textAvailableWidth - dateWidth) / 2;
    doc.text(dateText, dateX, dateY);

    const headerHeight = dateY + 6 - yPosition;
    yPosition += headerHeight + 10;

    // Student Section
    doc.setFillColor(...hexToRgb(colors.orange));
    doc.rect(margin, yPosition, 180, 10, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL ESTUDIANTE', margin + 5, yPosition + 7);

    yPosition += 20;
    doc.setTextColor(0, 0, 0);

    const studentData = [
      ['Nombre:', student[0].nombre_completo || 'N/A'],
      ['CURP:', studentCurp || 'N/A'],
      ['Grado y grupo:', `${student[0].grado ? `${student[0].grado}°` : ''} ${student[0].grupo || ''}`.trim() || 'N/A'],
    ];

    studentData.forEach(([label, value]) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRgb(colors.deepPink));
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value, margin + 55, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Tutors Section
    doc.setFillColor(...hexToRgb(colors.redOrange));
    doc.rect(margin, yPosition, 180, 10, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DE LOS TUTORES', margin + 5, yPosition + 7);

    yPosition += 20;
    doc.setTextColor(0, 0, 0);

    if (tutors.length === 0) {
      doc.setFontSize(12);
      doc.text('No se encontraron tutores para este estudiante.', margin, yPosition);
      yPosition += 10;
    } else {
      tutors.forEach((tutor, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRgb(colors.deepPink));
        doc.text(`Tutor ${index + 1}:`, margin, yPosition);
        yPosition += 8;

        const tutorData = [
          ['Nombre:', `${tutor.nombres} ${tutor.apellido_paterno} ${tutor.apellido_materno || ''}`],
          ['CURP:', tutor.curp || 'N/A'],
          ['Parentesco:', tutor.parentesco || 'N/A'],
          ['Teléfono:', tutor.telefono || 'N/A'],
          ['Email:', tutor.email || 'N/A'],
        ];

        tutorData.forEach(([label, value]) => {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...hexToRgb(colors.deepPink));
          doc.text(label, margin + 10, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(value, margin + 55, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      });
    }

    // Footer
    const footerY = 297 - 20;
    doc.setFillColor(...hexToRgb(colors.yellow));
    doc.rect(0, footerY, pageWidth, 5, 'F');
    doc.setFillColor(...hexToRgb(colors.orange));
    doc.rect(0, footerY + 5, pageWidth, 5, 'F');
    doc.setFillColor(...hexToRgb(colors.redOrange));
    doc.rect(0, footerY + 10, pageWidth, 5, 'F');
    doc.setFillColor(...hexToRgb(colors.deepPink));
    doc.rect(0, footerY + 15, pageWidth, 5, 'F');

    // Send PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=tutores_${studentCurp}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Upload tutors from PDF
export const uploadTutorsFromPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No se proporcionó un archivo PDF" });
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    // Simple parsing logic (assumes a structured format in the PDF)
    // Example format in PDF: "CURP: XXXX, Nombres: YYYY, Apellido Paterno: ZZZZ, ..."
    const tutors = [];
    const lines = text.split("\n");
    let currentTutor = {};

    for (const line of lines) {
      if (line.includes("CURP:")) {
        if (Object.keys(currentTutor).length > 0) {
          tutors.push(currentTutor);
          currentTutor = {};
        }
        const curp = line.split("CURP:")[1]?.trim().split(",")[0];
        currentTutor.curp = curp;
      } else if (line.includes("Nombres:")) {
        currentTutor.nombres = line.split("Nombres:")[1]?.trim().split(",")[0];
      } else if (line.includes("Apellido Paterno:")) {
        currentTutor.apellido_paterno = line
          .split("Apellido Paterno:")[1]
          ?.trim()
          .split(",")[0];
      } else if (line.includes("Apellido Materno:")) {
        currentTutor.apellido_materno = line
          .split("Apellido Materno:")[1]
          ?.trim()
          .split(",")[0];
      } else if (line.includes("Teléfono:")) {
        currentTutor.telefono = line
          .split("Teléfono:")[1]
          ?.trim()
          .split(",")[0];
      } else if (line.includes("Email:")) {
        currentTutor.email = line.split("Email:")[1]?.trim().split(",")[0];
      } else if (line.includes("Parentesco:")) {
        const parentescoTipo = line
          .split("Parentesco:")[1]
          ?.trim()
          .split(",")[0];
        const [parentesco] = await db.query(
          "SELECT id FROM parentesco WHERE tipo = ?",
          [parentescoTipo]
        );
        currentTutor.parentesco_id = parentesco[0]?.id || 1; // Default to "Padre" if not found
      } else if (line.includes("Estudiantes:")) {
        const estudiantes = line
          .split("Estudiantes:")[1]
          ?.trim()
          .split(",")
          .map((s) => s.trim());
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
      message: `Se registraron ${tutors.length} tutores exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
