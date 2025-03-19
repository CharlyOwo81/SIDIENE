import jsPDF from "jspdf";

const generatePDF = (incidentData: any) => {
  const doc = new jsPDF();

  // Agregar contenido al PDF
  doc.setFontSize(18);
  doc.text("Reporte de Incidencia", 10, 10);
  doc.setFontSize(12);
  doc.text(`CURP: ${incidentData.curp}`, 10, 20);
  doc.text(
    `Nombre: ${incidentData.nombres} ${incidentData.apellidoPaterno} ${incidentData.apellidoMaterno}`,
    10,
    30
  );
  doc.text(`Grado: ${incidentData.grado}`, 10, 40);
  doc.text(`Grupo: ${incidentData.grupo}`, 10, 50);
  doc.text(`Fecha: ${incidentData.fecha}`, 10, 60);
  doc.text(`Nivel de Severidad: ${incidentData.nivelSeveridad}`, 10, 70);
  doc.text(`Motivo: ${incidentData.motivo}`, 10, 80);
  doc.text(`Descripción: ${incidentData.descripcion}`, 10, 90);

  // Guardar el PDF
  doc.save("incidencia.pdf");
};
