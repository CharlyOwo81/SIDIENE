const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const app = express();
app.use(express.json());
app.use(cors());

const port = 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sidiene2025',
  database: 'sidiene_2025',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Contraseñas por rol
const contraseñasPorRol = {
  DIRECTIVO: '26Dst0056sD',
  PREFECTO: '26Dst0056sP',
  DOCENTE: '26Dst0056sDo',
  TRABAJADOR_SOCIAL: '26Dst0056sTS',
};

// Endpoint para registrar personal
app.post('/ManageStaff', async (req, res) => {
  const { curp, nombre, apellidoPaterno, apellidoMaterno, rol } = req.body;

  if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Asignar contraseña según el rol
    const contrasena = contraseñasPorRol[rol];

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar datos en la base de datos
    const sql = `
      INSERT INTO personal (curp, nombre, apellido_paterno, apellido_materno, rol, contrasena)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [curp, nombre, apellidoPaterno, apellidoMaterno, rol, hashedPassword];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error al insertar en la base de datos:", err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      return res.json({ message: 'Personal registrado exitosamente', contrasena });
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/login', async (req, res) => {
  const { curp, contrasena } = req.body;

  // Validación de entrada
  if (!curp || !contrasena) {
    return res.status(400).json({ message: 'CURP y contraseña son requeridos' });
  }

  try {
    const sql = 'SELECT * FROM personal WHERE curp = ?';
    const values = [curp];

    db.query(sql, values, async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'CURP no encontrada' });
      }

      const user = results[0];

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Respuesta exitosa
      return res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          curp: user.curp,
          rol: user.rol,
        },
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Configuración de multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Endpoint para manejar la carga de archivos PDF
// Endpoint para manejar la carga de archivos PDF y datos del formulario
app.post('/uploadStudents', upload.single('file'), async (req, res) => {
  const { curp, nombre, apellidoPaterno, apellidoMaterno, grado, grupo } = req.body;

  try {
    if (req.file) {
      // Si se cargó un archivo, procesarlo
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);

      // Procesar el contenido del PDF
      const students = parseStudentsFromPDF(data.text);

      if (students.length === 0) {
        return res.status(400).json({ message: 'No valid students found in the PDF' });
      }

      // Crear la consulta SQL para insertar múltiples filas
      const sql = `
        INSERT INTO alumnado (curp, nombre, apellido_paterno, apellido_materno, grado, grupo)
        VALUES ?
      `;
      const values = students.map(student => [
        student.curp,
        student.nombre,
        student.apellidoPaterno,
        student.apellidoMaterno,
        student.grado,
        student.grupo,
      ]);

      // Ejecutar la consulta SQL
      db.query(sql, [values], (err, results) => {
        if (err) {
          console.error("Error inserting students:", err);
          return res.status(500).json({ message: 'Error inserting students' });
        }
        return res.json({ message: 'Students registered successfully', students });
      });
    } else {
      // Si no se cargó un archivo, procesar los datos del formulario
      if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !grado || !grupo) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const sql = `
        INSERT INTO alumnado (curp, nombre, apellido_paterno, apellido_materno, grado, grupo)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [curp, nombre, apellidoPaterno, apellidoMaterno, grado, grupo];

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error al agregar estudiantes:", err);
          return res.status(500).json({ message: 'Error al agregar estudiantes' });
        }
        return res.json({ message: 'Estudiante registrado exitosamente', curp });
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: 'Error processing request' });
  } finally {
    // Eliminar el archivo temporal si existe
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

const parseStudentsFromPDF = (text) => {
  const lines = text.split('\n'); // Divide el texto en líneas
  const students = [];

  console.log("Contenido del PDF:", text); // Debug: Ver contenido crudo

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith("CURP") || line.startsWith("Apellido")) {
      continue; // Ignorar encabezados
    }

    console.log("Línea original:", line); // Debugging

    // Extraer CURP (18 caracteres exactos al inicio)
    const curpMatch = line.match(/^([A-Z0-9]{18})/);
    if (!curpMatch) {
      console.warn("Línea ignorada (CURP inválido):", line);
      continue;
    }
    const curp = curpMatch[1];

    // Extraer grado y grupo (últimos caracteres)
    const gradoGrupoMatch = line.match(/(\d)([A-Z])$/);
    if (!gradoGrupoMatch) {
      console.warn("Línea ignorada (grado/grupo inválidos):", line);
      continue;
    }
    const grado = parseInt(gradoGrupoMatch[1], 10);
    const grupo = gradoGrupoMatch[2];

    // Extraer nombres y apellidos (parte intermedia)
    const rawNameSection = line.substring(18, line.length - 2).trim();

    // Separar nombres y apellidos con una mejor estrategia
    const words = rawNameSection.split(/(?=[A-ZÁÉÍÓÚÑ])/); // Separar cuando hay mayúsculas
    const cleanWords = words.map(w => w.trim()).filter(w => w.length > 0);

    if (cleanWords.length < 3) {
      console.warn("Línea ignorada (nombre incompleto):", line);
      continue;
    }

    const apellidoMaterno = cleanWords.pop(); // Última palabra es el apellido materno
    const apellidoPaterno = cleanWords.pop(); // Penúltima palabra es el apellido paterno
    const nombre = cleanWords.join(" "); // Lo demás es el nombre

    students.push({
      curp,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      grado,
      grupo,
    });
  }

  console.log("Estudiantes extraídos:", students); // Debug: Ver estudiantes extraídos
  return students;
};



// Endpoint para agregar un estudiante manualmente
app.post('/ManageStudents', async (req, res) => {
  const { curp, nombre, apellidoPaterno, apellidoMaterno, grado, grupo } = req.body;

  if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !grado || !grupo) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const sql = `
    INSERT INTO students (curp, nombre, apellido_paterno, apellido_materno, grado, grupo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [curp, nombre, apellidoPaterno, apellidoMaterno, grado, grupo];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error al agregar estudiantes:", err);
      return res.status(500).json({ message: 'Error al agregar estudiantes' });
    }
    return res.json({ message: 'Estudiante registrado exitosamente', curp });
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});