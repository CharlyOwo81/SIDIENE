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

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  const { curp, contrasena } = req.body;

  if (!curp || !contrasena) {
    return res.status(400).json({ message: 'CURP y contraseña son requeridos' });
  }

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

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    return res.json({ message: 'Inicio de sesión exitoso', user: { rol: user.rol } });
  });
});

// Configuración de multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Endpoint para manejar la carga de archivos PDF
app.post('/uploadStudents', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Leer el archivo PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);

    // Procesar el contenido del PDF
    const students = parseStudentsFromPDF(data.text);

    if (students.length === 0) {
      return res.status(400).json({ message: 'No valid students found in the PDF' });
    }

    // Crear la consulta SQL para insertar múltiples filas
    const sql = `
      INSERT INTO students (curp, nombre, apellido_paterno, apellido_materno, grado, grupo)
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
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({ message: 'Error processing PDF' });
  } finally {
    // Eliminar el archivo temporal
    fs.unlinkSync(req.file.path);
  }
});

const parseStudentsFromPDF = (text) => {
  const lines = text.split('\n'); // Dividir el texto en líneas
  const students = [];

  console.log("Contenido del PDF:", text); // Depuración: Ver el contenido del PDF

  // Expresión regular para extraer los datos de cada línea
  const studentPattern = /([A-Z0-9]{18})([A-Za-zÁÉÍÓÚáéíóúñÑ\s]+)([A-Za-zÁÉÍÓÚáéíóúñÑ]+)([A-Za-zÁÉÍÓÚáéíóúñÑ]+)(\d+)([A-Za-z])/;

  // Ignorar la primera línea (encabezados)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      console.log("Línea procesada:", line); // Depuración: Ver cada línea procesada

      // Aplicar la expresión regular a la línea
      const match = line.match(studentPattern);

      if (match) {
        const [_, curp, nombre, apellidoPaterno, apellidoMaterno, grado, grupo] = match;

        students.push({
          curp,
          nombre: nombre.trim(),
          apellidoPaterno: apellidoPaterno.trim(),
          apellidoMaterno: apellidoMaterno.trim(),
          grado: parseInt(grado, 10), // Convertir a número
          grupo,
        });
      } else {
        console.warn("Línea ignorada (formato incorrecto):", line);
      }
    }
  }

  console.log("Estudiantes extraídos:", students); // Depuración: Ver los estudiantes extraídos
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
      console.error("Error inserting student:", err);
      return res.status(500).json({ message: 'Error inserting student' });
    }
    return res.json({ message: 'Student registered successfully', curp });
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});