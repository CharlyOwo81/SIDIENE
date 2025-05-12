// controllers/pdfController.js
import Expediente from '../models/Expediente.js';
import { jsPDF } from 'jspdf';

export const generateExpedientePDF = async (req, res) => {
  try {
    const { idEstudiante } = req.params;
    
    const expedientes = await Expediente.getByStudent(idEstudiante);
    
    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(12);
    doc.text(`Expediente del Estudiante: ${idEstudiante}`, 15, 15);
    
    // Contenido dinámico
    let yPosition = 30;
    expedientes.forEach((item, index) => {
      doc.text(`Incidencia ${index + 1}:`, 15, yPosition);
      doc.text(`- Fecha: ${new Date(item.incidencia_fecha).toLocaleDateString()}`, 20, yPosition + 5);
      doc.text(`- Motivo: ${item.incidencia_motivo}`, 20, yPosition + 10);
      doc.text(`- Descripción: ${item.descripcion}`, 20, yPosition + 15);
      
      if (item.acuerdo_descripcion) {
        doc.text(`Acuerdo:`, 15, yPosition + 20);
        doc.text(`- ${item.acuerdo_descripcion}`, 20, yPosition + 25);
        doc.text(`- Estatus: ${item.acuerdo_estatus}`, 20, yPosition + 30);
        yPosition += 35;
      } else {
        yPosition += 25;
      }
      
      yPosition += 15; // Espacio entre elementos
    });

    // Generar PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=expediente_${idEstudiante}.pdf`
    });
    res.send(pdfBuffer);
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};