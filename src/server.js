import app from './app.js'; // Use .js extension
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

// Importar las dependencias necesarias
// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const fs = require('fs');
// const pdf = require('pdf-parse');

// Crear una instancia de la aplicación Express
// const app = express();
// app.use(express.json()); // Middleware para parsear JSON
// app.use(cors()); // Middleware para habilitar CORS

// Puerto en el que se ejecutará el servidor
// const port = 5000;

// Configuración de la conexión a la base de datos MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'sidiene2025',
//   database: 'sidiene_2025',
// });

// Conectar a la base de datos MySQL
// db.connect((err) => {
//   if (err) throw err; // Manejo de errores de conexión
//   console.log('Connected to MySQL database!');
// });

// Contraseñas por rol
// const contraseñasPorRol = {
//   DIRECTIVO: '26Dst0056sD',
//   PREFECTO: '26Dst0056sP',
//   DOCENTE: '26Dst0056sDo',
//   TRABAJADOR_SOCIAL: '26Dst0056sTS',
// };

// Endpoint para buscar estudiantes con incidencias filtradas
// app.get('/search-incidents', (req, res) => {
//   const { grado, grupo, motivo, nivelSeveridad, descripcion, fecha, nombre, curp } = req.query;

//   let sql = `
//     SELECT 
//       estudiante.nombre, estudiante.apellido_paterno, estudiante.apellido_materno, 
//       estudiante.curp, estudiante.grado, estudiante.grupo, 
//       incidencia.motivo, incidencia.nivel_severidad, incidencia.descripcion, incidencia.fecha 
//     FROM estudiante
//     JOIN incidencia ON estudiante.curp = incidencia.curp
//     WHERE 1=1
//   `;
//   const params = [];

//   if (grado) {
//     sql += ` AND estudiante.grado = ?`;
//     params.push(grado);
//   }
//   if (grupo) {
//     sql += ` AND estudiante.grupo = ?`;
//     params.push(grupo);
//   }
//   if (motivo) {
//     sql += ` AND incidencia.motivo LIKE ?`;
//     params.push(`%${motivo}%`);
//   }
//   if (nivelSeveridad) {
//     sql += ` AND incidencia.nivel_severidad = ?`;
//     params.push(nivelSeveridad);
//   }
//   if (descripcion) {
//     sql += ` AND incidencia.descripcion LIKE ?`;
//     params.push(`%${descripcion}%`);
//   }
//   if (fecha) {
//     sql += ` AND incidencia.fecha = ?`;
//     params.push(fecha);
//   }
//   if (nombre) {
//     sql += ` AND (estudiante.nombre LIKE ? OR estudiante.apellido_paterno LIKE ? OR estudiante.apellido_materno LIKE ?)`;
//     params.push(`%${nombre}%`, `%${nombre}%`, `%${nombre}%`);
//   }
//   if (curp) {
//     sql += ` AND estudiante.curp = ?`;
//     params.push(curp);
//   }

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error al realizar la búsqueda' });
//     }
//     res.json(results);
//   });
// });

// Endpoint para registrar personal
// app.post('/ManageStaff', async (req, res) => {
//   const { curp, nombre, apellidoPaterno, apellidoMaterno, rol } = req.body;

//   if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !rol) {
//     return res.status(400).json({ message: 'Todos los campos son requeridos' });
//   }

//   try {
//     const contrasena = contraseñasPorRol[rol];
//     const hashedPassword = await bcrypt.hash(contrasena, 10);

//     const sql = `
//       INSERT INTO personal (curp, nombre, apellido_paterno, apellido_materno, rol, contrasena)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const values = [curp, nombre, apellidoPaterno, apellidoMaterno, rol, hashedPassword];

//     db.query(sql, values, (err, results) => {
//       if (err) {
//         console.error("Error al insertar en la base de datos:", err);
//         return res.status(500).json({ message: 'Error en el servidor' });
//       }
//       return res.json({ message: 'Personal registrado exitosamente', contrasena });
//     });
//   } catch (error) {
//     console.error("Error al encriptar la contraseña:", error);
//     return res.status(500).json({ message: 'Error en el servidor' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { curp, contrasena } = req.body;

//   if (!curp || !contrasena) {
//     return res.status(400).json({ message: 'CURP y contraseña son requeridos' });
//   }

//   try {
//     const sql = 'SELECT * FROM personal WHERE curp = ?';
//     const values = [curp];

//     db.query(sql, values, async (err, results) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ message: 'Error en el servidor' });
//       }

//       if (results.length === 0) {
//         return res.status(401).json({ message: 'CURP no encontrada' });
//       }

//       const user = results[0];
//       const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Contraseña incorrecta' });
//       }

//       return res.json({
//         message: 'Inicio de sesión exitoso',
//         user: {
//           id: user.id,
//           curp: user.curp,
//           nombre: user.nombre,
//           apellidoPaterno: user.apellido_paterno,
//           apellidoMaterno: user.apellido_materno,
//           rol: user.rol,
//         },
//       });
//     });
//   } catch (error) {
//     console.error("Error en el servidor:", error);
//     return res.status(500).json({ message: 'Error en el servidor' });
//   }
// });

// const cron = require("node-cron");

// cron.schedule("0 0 * * *", () => {
//   const query = `
//     UPDATE estudiante 
//     SET estado = 'Egresado' 
//     WHERE anio_egreso IS NOT NULL AND anio_egreso <= YEAR(CURDATE()) AND estado = 'Activo'
//   `;

//   db.query(query, (err, result) => {
//     if (err) {
//       console.error("Error actualizando estados de estudiantes:", err);
//     } else {
//       console.log(`Estados de estudiantes actualizados: ${result.affectedRows}`);
//     }
//   });
// });

// app.get('/students', (req, res) => {
//   const { grado, grupo } = req.query;

//   if (!grado || !grupo) {
//     return res.status(400).json({ message: 'Grado y grupo son requeridos' });
//   }

//   const sql = `
//     SELECT curp, nombre, apellido_paterno, apellido_materno, grado, grupo 
//     FROM estudiante 
//     WHERE grado = ? AND grupo = ?
//   `;
//   const values = [grado, grupo];

//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error("Error al consultar estudiantes:", err);
//       return res.status(500).json({ message: 'Error en el servidor' });
//     }
//     res.json(results);
//   });
// });

// app.get('/incidents', (req, res) => {
//   const { curp } = req.query;

//   if (!curp) {
//     return res.status(400).json({ message: 'CURP es requerida' });
//   }

//   const sql = `
//     SELECT * FROM incidencia 
//     WHERE id_estudiante = ?
//   `;
//   const values = [curp];

//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error("Error al consultar incidencias:", err);
//       return res.status(500).json({ message: 'Error en el servidor' });
//     }
//     res.json(results);
//   });
// });

// const formatDateForMySQL = (date) => {
//   const [day, month, year] = date.split('/');
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// };

// const isValidDate = (date) => {
//   const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
//   return regex.test(date);
// };

// app.post('/uploadIncidents', (req, res) => {
//   const {
//     id_estudiante,
//     id_personal,
//     fecha,
//     nivel_severidad,
//     motivo,
//     descripcion,
//   } = req.body;

//   if (
//     !id_estudiante ||
//     !id_personal ||
//     !fecha ||
//     !nivel_severidad ||
//     !motivo ||
//     !descripcion
//   ) {
//     return res.status(400).json({ message: 'Todos los campos son requeridos' });
//   }

//   if (!isValidDate(fecha)) {
//     return res.status(400).json({ message: 'Formato de fecha no válido. Use DD/MM/YYYY' });
//   }

//   const formattedDate = formatDateForMySQL(fecha);

//   const sql = `
//     INSERT INTO incidencia 
//     (id_estudiante, id_personal, fecha, nivel_severidad, motivo, descripcion)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;
//   const values = [
//     id_estudiante,
//     id_personal,
//     formattedDate,
//     nivel_severidad,
//     motivo,
//     descripcion,
//   ];

//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error("Error al insertar incidente:", err);
//       return res.status(500).json({ message: 'Error en el servidor' });
//     }
//     return res.json({ message: 'Incidente registrado exitosamente' });
//   });
// });

// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });
