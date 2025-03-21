import app from './src/app.js'; // Use .js extension
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3306;

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

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



// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });
