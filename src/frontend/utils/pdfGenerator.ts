import jsPDF from "jspdf";
import { ExpedienteService } from "../../backend/services/expedienteService";

// Tipos para las dependencias
interface Student {
  curp: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  grupo: string;
  grado: string;
}

interface Alert {
  message: string;
  type: "success" | "error" | "warning";
}

const generatePDF = async (
  selectedStudents: string[],
  students: Student[],
  setLoading: (loading: boolean) => void,
  setAlert: (alert: Alert | null) => void,
  tecnica56Logo: string,
  sonoraLogo: string
) => {
  setLoading(true);
  setAlert(null);

  if (selectedStudents.length === 0) {
    setAlert({
      message: "Selecciona al menos un estudiante",
      type: "warning",
    });
    setLoading(false);
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helpers
  const safeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Sin fecha registrada" : date.toLocaleDateString("es-MX");
    } catch {
      return "Sin fecha registrada";
    }
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return [r, g, b];
  };

  // Paleta de colores
  const colors = {
    yellow: "#F3C44D",
    orange: "#E5823E",
    redOrange: "#C26444",
    deepPink: "#891547",
    statusGreen: "#4CAF50",
    statusYellow: "#FFEB3B",
    statusRed: "#F44336",
  };

  const severityColors: { [key: string]: string } = {
    leve: colors.yellow,
    severo: colors.orange,
    grave: colors.deepPink,
  };

  const statusColors: { [key: string]: string } = {
    cumplido: colors.statusGreen,
    en_proceso: colors.statusYellow,
    incumplido: colors.statusRed,
  };

  // Función para la cabecera
  const addHeader = (yPosition: number): number => {
    const margin = 15;
    const pageWidth = 210;
    const logoLeftWidth = 28;
    const logoRightWidth = 28;

    try {
      doc.addImage(tecnica56Logo, "PNG", margin, yPosition, logoLeftWidth, 18);
      doc.addImage(
        sonoraLogo,
        "PNG",
        pageWidth - margin - logoRightWidth,
        yPosition,
        logoRightWidth,
        14
      );
    } catch (error) {
      console.error("Error cargando logos:", error);
      doc.setFont("helvetica", "normal")
        .setFontSize(10)
        .setTextColor(255, 0, 0)
        .text("No se pudieron cargar los logos", margin, yPosition + 10);
    }

    const textStartX = margin + logoLeftWidth + 5;
    const textWidth = pageWidth - 2 * margin - logoLeftWidth - logoRightWidth - 10;

    // Títulos
    doc.setFont("helvetica", "bold")
      .setFontSize(16)
      .setTextColor(0)
      .text(
        "ESCUELA SECUNDARIA TÉCNICA NO. 56",
        textStartX +
          (textWidth - doc.getTextWidth("ESCUELA SECUNDARIA TÉCNICA NO. 56")) / 2,
        yPosition + 10
      )
      .setFontSize(14)
      .text(
        "Expediente Único de Incidencias",
        textStartX +
          (textWidth - doc.getTextWidth("Expediente Único de Incidencias")) / 2,
        yPosition + 18
      );

    // Subtítulos
    let y = yPosition + 26;
    doc.setFont("helvetica", "normal").setFontSize(12);
    doc
      .splitTextToSize(
        "Sistema de Digitalización de Expedientes e Incidencias para la Nueva Escuela",
        textWidth
      )
      .forEach((line: string) => {
        doc.text(line, textStartX + (textWidth - doc.getTextWidth(line)) / 2, y);
        y += 7;
      });

    // Fecha
    const dateText = `PDF generado: ${new Date().toLocaleDateString("es-MX")}`;
    doc.text(dateText, textStartX + (textWidth - doc.getTextWidth(dateText)) / 2, y + 6);

    return y + 12 - yPosition;
  };

  // Footer con estilo
  const addFooter = () => {
    const y = 297 - 20;
    [colors.yellow, colors.orange, colors.redOrange, colors.deepPink].forEach(
      (color, i) => {
        doc.setFillColor(...hexToRgb(color)).rect(0, y + i * 5, 210, 5, "F");
      }
    );
  };

  // Control de saltos de página
  const checkSpace = (requiredHeight: number, yPosition: number): boolean => {
    if (yPosition + requiredHeight > 295) {
      doc.addPage();
      return true;
    }
    return false;
  };

  try {
    for (const [studentIndex, curp] of selectedStudents.entries()) {
      const { data } = await ExpedienteService.getByStudent(curp);
      const expediente = data?.[0];
      const student = students.find((s) => s.curp === curp);

      if (!student || !expediente) {
        setAlert({
          message: `Estudiante ${curp} no encontrado`,
          type: "warning",
        });
        continue;
      }

      // Página inicial del estudiante
      if (studentIndex > 0) doc.addPage();
      let yPosition = 15;
      const margin = 15;
      const pageWidth = 210;

      const headerHeight = addHeader(yPosition);
      yPosition += headerHeight + 5;

      // Datos del estudiante
      doc
        .setFillColor(...hexToRgb(colors.orange))
        .rect(margin, yPosition, pageWidth - 2 * margin, 10, "F")
        .setFont("helvetica", "bold")
        .setFontSize(14)
        .setTextColor(255, 255, 255)
        .text("DATOS DEL ESTUDIANTE", margin + 5, yPosition + 7);

      yPosition += 15;
      const studentInfo = [
        [
          "Nombre:",
          `${student.nombres} ${student.apellido_paterno} ${
            student.apellido_materno || ""
          }`,
        ],
        ["CURP:", curp],
        ["Grado/Grupo:", `${student.grado}° ${student.grupo}`],
      ];

      doc.setFontSize(12);
      studentInfo.forEach(([label, value]) => {
        doc
          .setFont("helvetica", "bold")
          .setTextColor(...hexToRgb(colors.deepPink))
          .text(label, margin + 5, yPosition);
        doc
          .setFont("helvetica", "normal")
          .setTextColor(0)
          .text(value, margin + 40, yPosition, { maxWidth: pageWidth - margin - 50 });
        yPosition += 8;
      });

      // Incidencias
      if (expediente.incidencias?.length) {
        for (const [idx, incidencia] of expediente.incidencias.entries()) {
          doc.addPage();
          yPosition = 15;
          const headerHeight = addHeader(yPosition);
          yPosition += headerHeight + 5;

          // Encabezado incidencia
          doc
            .setFillColor(...hexToRgb(colors.redOrange))
            .rect(margin, yPosition, pageWidth - 2 * margin, 10, "F")
            .setFont("helvetica", "bold")
            .setFontSize(14)
            .setTextColor(255)
            .text(`INCIDENCIA ${idx + 1}`, margin + 5, yPosition + 7);
          yPosition += 15;

          // Detalles incidencia
          const incidentDetails = [
            ["Fecha:", safeDate(incidencia.fecha)],
            ["Severidad:", incidencia.nivel_severidad || "N/A"],
            ["Motivo:", incidencia.motivo || "N/A"],
            ["Descripción:", incidencia.descripcion || "N/A"],
          ];

          doc.setFontSize(12);
          incidentDetails.forEach(([label, value]) => {
            if (checkSpace(20, yPosition)) {
              yPosition = 15 + addHeader(15) + 5;
              doc
                .setFillColor(...hexToRgb(colors.redOrange))
                .rect(margin, yPosition, pageWidth - 2 * margin, 10, "F")
                .setFont("helvetica", "bold")
                .setFontSize(14)
                .setTextColor(255)
                .text(`INCIDENCIA ${idx + 1}`, margin + 5, yPosition + 7);
              yPosition += 15;
            }
            doc
              .setFont("helvetica", "bold")
              .setTextColor(...hexToRgb(colors.deepPink))
              .text(label, margin + 5, yPosition);
            if (label === "Severidad:") {
              doc
                .setFillColor(
                  ...hexToRgb(
                    severityColors[incidencia.nivel_severidad?.toLowerCase()] ||
                      colors.deepPink
                  )
                )
                .circle(margin + 45, yPosition - 2, 3, "F");
              doc
                .setFont("helvetica", "normal")
                .setTextColor(0)
                .text(value, margin + 50, yPosition, {
                  maxWidth: pageWidth - margin - 60,
                });
            } else {
              doc
                .setFont("helvetica", "normal")
                .setTextColor(0)
                .text(value, margin + 40, yPosition, {
                  maxWidth: pageWidth - margin - 50,
                });
            }
            yPosition += 10;
          });

          // Acuerdos
          if (incidencia.acuerdos?.length) {
            if (checkSpace(25, yPosition)) {
              doc.addPage();
              yPosition = 15 + addHeader(15) + 5;
            }
            doc
              .setFont("helvetica", "bold")
              .setFontSize(12)
              .setTextColor(...hexToRgb(colors.deepPink))
              .text("ACUERDOS:", margin + 5, yPosition);
            yPosition += 10;

            incidencia.acuerdos.forEach((acuerdo) => {
              if (checkSpace(40, yPosition)) {
                doc.addPage();
                yPosition = 15 + addHeader(15) + 5;
                doc
                  .setFont("helvetica", "bold")
                  .setFontSize(12)
                  .setTextColor(...hexToRgb(colors.deepPink))
                  .text("ACUERDOS:", margin + 5, yPosition);
                yPosition += 10;
              }

              const acuerdoDetails = [
                ["Descripción:", acuerdo.descripcion || "N/A"],
                ["Creado el:", safeDate(acuerdo.fecha_creacion)],
                ["Estatus:", acuerdo.estatus || "N/A"],
              ];

              acuerdoDetails.forEach(([label, value]) => {
                doc
                  .setFont("helvetica", "bold")
                  .setTextColor(...hexToRgb(colors.deepPink))
                  .text(label, margin + 15, yPosition);
                if (label === "Estatus:") {
                  doc
                    .setFillColor(
                      ...hexToRgb(
                        statusColors[acuerdo.estatus.toLowerCase()] ||
                          colors.deepPink
                      )
                    )
                    .circle(margin + 55, yPosition - 2, 3, "F");
                  doc
                    .setFont("helvetica", "normal")
                    .setTextColor(0)
                    .text(value, margin + 60, yPosition, {
                      maxWidth: pageWidth - margin - 70,
                    });
                } else {
                  doc
                    .setFont("helvetica", "normal")
                    .setTextColor(0)
                    .text(value, margin + 50, yPosition, {
                      maxWidth: pageWidth - margin - 60,
                    });
                }
                yPosition += 10;
              });
              yPosition += 5;
            });
          } else {
            if (checkSpace(20, yPosition)) {
              doc.addPage();
              yPosition = 15 + addHeader(15) + 5;
            }
            doc
              .setFont("helvetica", "bold")
              .setFontSize(12)
              .setTextColor(...hexToRgb(colors.deepPink))
              .text("ACUERDOS:", margin + 5, yPosition);
            doc
              .setFont("helvetica", "normal")
              .setTextColor(0)
              .text("No hay acuerdos establecidos.", margin + 15, yPosition + 7);
            yPosition += 5;
          }

          // Firmas
          if (checkSpace(50, yPosition)) {
            doc.addPage();
            yPosition = 1 + addHeader(5) + 1;
          }
          doc
            .setFont("helvetica", "italic")
            .setFontSize(12)
            .setTextColor(...hexToRgb(colors.deepPink));
          doc.text("Firma Tutor Legal:", margin, yPosition + 20);
          doc.text("Firma Prefecto:", pageWidth - margin - 75, yPosition + 20);

          doc
            .setLineWidth(0.3)
            .line(margin, yPosition + 35, margin + 75, yPosition + 35)
            .line(
              pageWidth - margin - 75,
              yPosition + 35,
              pageWidth - margin,
              yPosition + 35
            );

          yPosition += 20;

          addFooter();
        }
      } else {
        // Página sin incidencias
        doc.addPage();
        yPosition = 15;
        const headerHeight = addHeader(yPosition);
        yPosition += headerHeight + 5;

        // Datos del estudiante
        doc
          .setFillColor(...hexToRgb(colors.orange))
          .rect(margin, yPosition, pageWidth - 2 * margin, 10, "F")
          .setFont("helvetica", "bold")
          .setFontSize(14)
          .setTextColor(255, 255, 255)
          .text("DATOS DEL ESTUDIANTE", margin + 5, yPosition + 7);

        yPosition += 15;
        doc.setFontSize(12);
        studentInfo.forEach(([label, value]) => {
          doc
            .setFont("helvetica", "bold")
            .setTextColor(...hexToRgb(colors.deepPink))
            .text(label, margin + 5, yPosition);
          doc
            .setFont("helvetica", "normal")
            .setTextColor(0)
            .text(value, margin + 40, yPosition, {
              maxWidth: pageWidth - margin - 50,
            });
          yPosition += 8;
        });

        yPosition += 10;
        doc
          .setFont("helvetica", "bold")
          .setFontSize(12)
          .setTextColor(...hexToRgb(colors.deepPink))
          .text("NO SE REGISTRAN INCIDENCIAS", margin + 5, yPosition);

        addFooter();
      }
    }

    const firstSelectedCurp = selectedStudents[0] || "sin_curp";
    doc.save(`expediente_${firstSelectedCurp}_${new Date().toISOString().slice(0, 10)}.pdf`);
    setAlert({ message: "PDF generado con éxito ✨", type: "success" });
  } catch (error) {
    console.error("Error:", error);
    setAlert({
      message: `Error: ${error instanceof Error ? error.message : "Desconocido"}`,
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

export default generatePDF;