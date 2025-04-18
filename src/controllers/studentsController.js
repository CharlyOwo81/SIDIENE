import Student from "../models/studentModel.js";
import multer from "multer";
import db from "../config/db.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadPdf = [
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Upload PDF endpoint hit");

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File received:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      const pdfBuffer = req.file.buffer;
      const pdfUint8Array = new Uint8Array(pdfBuffer);

      const loadingTask = pdfjsLib.getDocument({ data: pdfUint8Array });
      const pdf = await loadingTask.promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      }
      console.log("Extracted text:", text.substring(0, 200) + "...");

      const students = parseStudentsFromPdf(text);
      console.log("Parsed students:", students);

      if (students.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid students found in the PDF",
          sampleText: text.substring(0, 500) || "No text available",
        });
      }

      const errors = [];
      const validStudents = students.filter((student, index) => {
        if (!student.curp || !/^[A-Za-z0-9]{18}$/.test(student.curp)) {
          errors.push(`Line ${index + 1}: Invalid CURP (${student.curp})`);
          return false;
        }
        if (!student.nombres) {
          errors.push(`Line ${index + 1}: Name is required`);
          return false;
        }
        return true;
      });

      const result = await Student.bulkCreate(validStudents);
      console.log("Database result:", result);

      return res.status(201).json({
        success: true,
        message: `${validStudents.length} estudiantes procesados (${result.created} nuevos, ${result.updated} actualizados)`,
        data: {
          valid: validStudents.length,
          created: result.created,
          updated: result.updated,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: "File upload error", error: error.message });
      }
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },
];

function parseStudentsFromPdf(text) {
  // Split by tabs or multiple spaces to get all columns
  const columns = text.split(/\t|\s{2,}/).filter((col) => col.trim());
  console.log("All columns:", columns);

  if (columns.length < 7) {
    console.log("Not enough columns to parse");
    return [];
  }

  const students = [];
  const headerRegex = /CURP\s*Nombres/i;
  const curpRegex = /^[A-Za-z0-9]{18}$/;

  // Check if the first column is part of the header
  let startIndex = 0;
  if (headerRegex.test(columns[0])) {
    startIndex = 7; // Skip the 7 header columns
  }

  // Process columns in groups of 7
  for (let i = startIndex; i < columns.length; i += 7) {
    if (i + 6 < columns.length) {
      // Ensure we have all 7 columns
      const student = {
        curp: columns[i],
        nombres: columns[i + 1],
        apellidoPaterno: columns[i + 2],
        apellidoMaterno: columns[i + 3],
        grado: columns[i + 4],
        grupo: columns[i + 5],
        anio_ingreso: columns[i + 6],
      };

      if (curpRegex.test(student.curp) && student.nombres) {
        students.push(student);
      } else {
        console.warn(`Invalid student data at index ${i}:`, student);
      }
    } else {
      console.warn(`Incomplete student data at index ${i}:`, columns.slice(i));
    }
  }

  console.log("Parsed students:", students);
  return students;
}
export const createStudent = async (req, res) => {
  try {
    const {
      curp,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      grado,
      grupo,
      anio_ingreso,
    } = req.body;

    if (
      !curp ||
      !nombres ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !grado ||
      !grupo ||
      !anio_ingreso
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    // Validar que el grado sea uno de los permitidos
    const validGrados = ["1", "2", "3"];
    if (!validGrados.includes(grado)) {
      return res.status(400).json({
        error: `Invalid grado value: ${grado}. Allowed values are 1, 2, 3.`,
      });
    }

    // Insertar el estudiante en la base de datos
    const studentId = await Student.create(req.body);
    res
      .status(201)
      .json({ id: studentId, message: "Estudiante creado de manera exitosa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllStudents = async (req, res) => {
  try {
    const { searchQuery, grado, grupo } = req.query;

    // Validate empty filters
    const hasFilters = searchQuery || grado || grupo;
    if (!hasFilters) {
      return res.status(200).json({
        success: true,
        warning: "Por favor aplique al menos un filtro para ver los resultados",
        data: []
      });
    }

    let query = `
      SELECT nombres, apellido_paterno, apellido_materno, grado, grupo, curp
      FROM estudiante
      WHERE 1=1
    `;
    const values = [];

    // Search query handling
    if (searchQuery) {
      query += ` AND (
        nombres LIKE ? OR 
        apellido_paterno LIKE ? OR 
        apellido_materno LIKE ? OR 
        curp LIKE ? OR 
        anio_ingreso LIKE ?
      )`;
      const searchTerm = `%${searchQuery}%`;
      values.push(
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm
      );
    }

    // Exact match for grado
    if (grado) {
      query += ` AND grado IN (?)`;
      values.push(grado.split(','));
    }

    // Exact match for grupo
    if (grupo) {
      query += ` AND grupo IN (?)`;
      values.push(grupo.split(','));
    }

    console.log("Final query:", query);
    console.log("Query values:", values);

    const [rows] = await db.query(query, values);

    // Format response
    const formattedRows = rows.map(student => ({
      nombres: student.nombres || "",
      apellidoPaterno: student.apellido_paterno || "",
      apellidoMaterno: student.apellido_materno || "",
      grado: student.grado || "",
      grupo: student.grupo || "",
      curp: student.curp || "",
    }));

    res.status(200).json({
      success: true,
      data: formattedRows,
      count: formattedRows.length
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error del servidor"
    });
  }
};

export const getStudentByCurp = async (req, res) => {
  try {
    const { curp } = req.params;

    if (!curp || curp.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "La CURP no puede ser vacía.",
      });
    }

    const student = await Student.getById(curp);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado.",
      });
    }

    // Formatear la respuesta con nombres de campos consistentes
    const formattedStudent = {
      curp: student.curp,
      nombres: student.nombres,
      apellidoPaterno: student.apellido_paterno || student.apellidoPaterno,
      apellidoMaterno: student.apellido_materno || student.apellidoMaterno,
      grado: student.grado,
      grupo: student.grupo,
      anio_ingreso: student.anio_ingreso,
      anio_egreso: student.anio_egreso,
      estatus: student.estatus,
    };

    res.status(200).json({
      success: true,
      data: formattedStudent,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el estudiante",
      error: error.message,
    });
  }
};

// In your studentsController.js
export const updateStudent = async (req, res) => {
  try {
    const { curp } = req.params;
    const {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      grado,
      grupo,
      anio_ingreso,
      estatus,
    } = req.body;

    console.log("Updating student with CURP:", curp);
    console.log("Update data:", req.body);

    const result = await Student.updateById(curp, {
      nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      grado,
      grupo,
      anio_ingreso,
      estatus,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estudiante actualizado con éxito.",
      data: {
        curp: result.curp,
        nombres: result.nombres,
        apellidoPaterno: result.apellido_paterno,
        apellidoMaterno: result.apellido_materno,
        grado: result.grado,
        grupo: result.grupo,
        anio_ingreso: result.anio_ingreso,
        estatus: result.estatus,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el estudiante",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.delete(req.params.id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
