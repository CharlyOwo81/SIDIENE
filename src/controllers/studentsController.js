import Student from "../models/studentModel.js";
import multer from "multer";
import db from "../config/db.js";
import pdf from "pdf-parse";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const preprocessPDFText = (text) => {
  let cleanedText = text
    .replace(/\r?\n+/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Fix concatenated headers
  cleanedText = cleanedText.replace(
    /curpnombresapellido_paternoapellido_maternogradogrupoanio_ingresoanio_egresoestatus/gi,
    'curp|nombres|apellido_paterno|apellido_materno|grado|grupo|anio_ingreso|anio_egreso|estatus'
  );

  const processNames = (namePart) => {
    let processed = namePart
      .replace(/([a-zñáéíóú])([A-ZÑÁÉÍÓÚ])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    const nameParts = processed.split(' ');
    
    let nombres = '';
    let apellido_paterno = '';
    let apellido_materno = '';

    if (nameParts.length >= 4) {
      nombres = nameParts.slice(0, 2).join(' ');
      apellido_paterno = nameParts.slice(2, -1).join(' ');
      apellido_materno = nameParts[nameParts.length - 1];
    } else if (nameParts.length === 3) {
      nombres = nameParts[0];
      apellido_paterno = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 2) {
      nombres = nameParts[0];
      apellido_paterno = nameParts[1];
    } else {
      nombres = processed;
    }

    return { nombres, apellido_paterno, apellido_materno };
  };

  const lines = cleanedText.split('\n').map(line => {
    if (!line.trim() || line === 'SO') return null;

    // Enhanced academic field detection
    const academicRegex = /(\d{1,2})[\s|]*([A-Z])[\s|]*(\d{4})[\s|]*(\d{4})?[\s|]*([A-ZÁÉÍÓÚ\s]+)$/i;
    const academicMatch = line.match(academicRegex);

    let grado = '';
    let grupo = '';
    let anio_ingreso = '';
    let anio_egreso = '';
    let estatus = '';
    let namePart = line;

    if (academicMatch) {
      [, grado, grupo, anio_ingreso, anio_egreso, estatus] = academicMatch;
      namePart = line.replace(academicRegex, '').trim();
    }

    // Extract CURP
    const curpRegex = /^([A-Z0-9]{18})[|\s]*/i;
    const curpMatch = namePart.match(curpRegex);
    let curp = '';
    if (curpMatch) {
      curp = curpMatch[1];
      namePart = namePart.slice(curpMatch[0].length).trim();
    }

    // Process names
    const { nombres, apellido_paterno, apellido_materno } = processNames(namePart);

    return [
      curp,
      nombres,
      apellido_paterno,
      apellido_materno,
      grado,
      grupo,
      anio_ingreso || '-',
      anio_egreso || '-',
      estatus.replace('BAJA ADMINISTRATIVA', 'EGRESADO').trim() || 'ACTIVO'
    ].join('|');
  });

  return {
    cleanedText: lines.filter(line => line).join('\n'),
    detectedDelimiter: '|'
  };
};

// Preprocesamiento mejorado
const detectPDFStructure = (cleanedText) => {
  const lines = cleanedText.split('\n').filter(line => line.trim());
  if (!lines.length) {
    return { structure: 'unknown', headers: [], delimiter: '|' };
  }

  // Usar encabezados esperados
  const expectedHeaders = [
    'curp',
    'nombres',
    'apellido_paterno',
    'apellido_materno',
    'grado',
    'grupo',
    'anio_ingreso',
    'anio_egreso',
    'estatus'
  ];

  // Verificar si la primera línea contiene los encabezados esperados
  const firstLine = lines[0];
  const headers = firstLine.split('|').map(h => h.trim().toLowerCase());
  const isTable = expectedHeaders.some(header => headers.includes(header));

  return {
    structure: isTable ? 'table' : 'list',
    headers: expectedHeaders,
    delimiter: '|'
  };
};

// Expresión regular optimizada
const parseStudents = (cleanedText, structureInfo) => {
  const lines = cleanedText.split('\n').filter(line => line.trim());
  const students = [];

  lines.forEach((line, index) => {
    const fields = line.split('|').map(f => f.trim());
    if (fields.length < 5) return;

    const student = {
      curp: fields[0]?.toUpperCase(),
      nombres: fields[1],
      apellido_paterno: fields[2],
      apellido_materno: fields[3],
      grado: fields[4],
      grupo: fields[5],
      anio_ingreso: fields[6] === '-' ? null : fields[6],
      anio_egreso: fields[7] === '-' ? null : fields[7],
      estatus: fields[8] || 'ACTIVO'
    };

    students.push(student);
  });

  return students;
};

// Validación completa
const validateStudent = (student, lineIndex) => {
  const errors = [];

  // Validar CURP
  const cleanCurp = student.curp?.replace(/\s/g, '');
  if (!cleanCurp || !/^[A-Z0-9]{18}$/.test(cleanCurp)) {
    errors.push(`Línea ${lineIndex + 1}: CURP inválida: ${student.curp}`);
  } else {
    student.curp = cleanCurp;
  }

  // Validar nombres
  if (!student.nombres?.trim() || !/^[A-Za-zÁ-ú\s-]+$/.test(student.nombres)) {
    errors.push(`Línea ${lineIndex + 1}: Nombre inválido: ${student.nombres}`);
  }

  // Validar apellido_paterno (opcional)
  if (student.apellido_paterno && !/^[A-Za-zÁ-ú\s-]+$/.test(student.apellido_paterno)) {
    errors.push(`Línea ${lineIndex + 1}: Apellido paterno inválido: ${student.apellido_paterno}`);
  }

  // Validar apellido_materno (opcional)
  if (student.apellido_materno && !/^[A-Za-zÁ-ú\s-]+$/.test(student.apellido_materno)) {
    errors.push(`Línea ${lineIndex + 1}: Apellido materno inválido: ${student.apellido_materno}`);
  }

  if (!['1', '2', '3'].includes(student.grado)) {
    errors.push(`Línea ${lineIndex + 1}: Grado inválido: ${student.grado}`);
  }

  if (student.anio_ingreso && !/^\d{4}$/.test(student.anio_ingreso)) {
    errors.push(`Línea ${lineIndex + 1}: Año ingreso inválido: ${student.anio_ingreso}`);
  }

  if (student.anio_egreso && !/^\d{4}$/.test(student.anio_egreso)) {
    errors.push(`Línea ${lineIndex + 1}: Año egreso inválido: ${student.anio_egreso}`);
  }

  if (student.grupo && !['A', 'B', 'C', 'D', 'E', 'F'].includes(student.grupo)) {
    errors.push(`Línea ${lineIndex + 1}: Grupo inválido: ${student.grupo}`);
  }

  if (student.estatus && !['ACTIVO', 'EGRESADO'].includes(student.estatus)) {
    errors.push(`Línea ${lineIndex + 1}: Estatus inválido: ${student.estatus}`);
  }

  return { isValid: errors.length === 0, errors };
};

// Controlador unificado para subida de PDF
export const uploadStudents = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        console.log("No file received in request");
        return res.status(400).json({ success: false, message: "No se subió ningún archivo" });
      }

      console.log('Received file:', req.file.originalname, req.file.size, req.file.mimetype);

      // Procesar PDF
      const { text } = await pdf(req.file.buffer);
      console.log('Extracted PDF text:', text.substring(0, 300));
      if (!text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "El PDF está vacío o no contiene texto extraíble",
        });
      }

      const { cleanedText, detectedDelimiter } = preprocessPDFText(text);
      console.log('Cleaned text:', cleanedText.substring(0, 300));
      if (!cleanedText || cleanedText.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "No se pudo extraer contenido válido del PDF",
          sample: text.substring(0, 300),
        });
      }

      const structureInfo = detectPDFStructure(cleanedText);
      console.log('Detected structure:', structureInfo);
      const rawStudents = parseStudents(cleanedText, structureInfo);
      console.log('Parsed students:', rawStudents);

      // Validar estudiantes
      const validationResults = rawStudents.map((student, index) => validateStudent(student, index));
      const validStudents = [];
      const errors = [];

      validationResults.forEach((result, index) => {
        if (result.isValid) {
          validStudents.push(rawStudents[index]);
        } else {
          errors.push(...result.errors);
        }
      });

      if (validStudents.length === 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({
          success: false,
          message: "No se encontraron estudiantes válidos",
          sample: cleanedText.substring(0, 300),
          errors,
        });
      }

      // Insertar en base de datos
      const dbResult = await Student.bulkCreate(validStudents);

      res.json({
        success: true,
        message: `Procesados ${validStudents.length} estudiantes`,
        data: {
          valid: validStudents.length,
          created: dbResult.created,
          updated: dbResult.updated,
          errors: errors.length,
          sampleErrors: errors.slice(0, 5),
          detectedDelimiter,
          structure: structureInfo.structure,
          headers: structureInfo.headers,
        },
      });
    } catch (error) {
      console.error("Error en subida:", error);
      const statusCode = error instanceof multer.MulterError ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message.includes("PDF")
          ? "El archivo PDF está corrupto o no es válido"
          : error instanceof multer.MulterError
          ? "Error al procesar el archivo: " + error.message
          : "Error interno del servidor",
        error: error.message,
      });
    }
  },
];

// Resto de controladores...

  // Resto de controladores (getAllStudents, createStudent, etc.) se mantienen similares
  // con mejoras en manejo de errores y validaciones

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

  // Get students by grado and grupo
  export const getStudentsByGradeGroup = async (req, res) => {
    try {
      const { grado, grupo } = req.query;
      if (!grado || !grupo) {
        return res.status(400).json({ success: false, message: 'Faltan grado o grupo' });
      }

      const [results] = await db.query(`
        SELECT curp, CONCAT(nombres, ' ', apellido_paterno, ' ', COALESCE(apellido_materno, '')) AS nombre_completo
        FROM estudiante
        WHERE grado = ? AND grupo = ?
      `, [grado, grupo]);

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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
