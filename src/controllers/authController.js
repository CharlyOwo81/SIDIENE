import db from '../config/db.js'; // Importa db correctamente
import bcryptjs from 'bcryptjs';

export const loginUser = async (req, res) => {
  const { telefono, contrasenia } = req.body;
  console.log("Datos recibidos:", { telefono, contrasenia }); // Depuración

  // Validate input
  if (!telefono || !contrasenia) {
    return res.status(400).json({ message: 'Teléfono y contraseña son requeridos' });
  }

  try {
    const sql = 'SELECT * FROM personal WHERE telefono = ?';
    db.query(sql, [telefono], async (err, results) => {
      if (err) {
        console.error("Database error:", err); // Depuración
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      console.log("Resultados de la consulta:", results); // Depuración

      if (results.length === 0) {
        return res.status(401).json({ message: 'Teléfono no encontrado' });
      }

      const user = results[0];
      console.log("Usuario encontrado:", user); // Depuración

      // Verify the password
      const isPasswordValid = await bcryptjs.compare(contrasenia, user.contrasenia);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Successful response
      return res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          curp: user.curp,
          nombre: user.nombres,
          apellidoPaterno: user.apellido_paterno,
          apellidoMaterno: user.apellido_materno,
          telefono: user.telefono,
          rol: user.rol,
        },
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error); // Depuración
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};