import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const loginUser = async (req, res) => {
  const { telefono, contrasenia } = req.body;

  if (!telefono || !contrasenia) {
    return res.status(400).json({ message: 'Teléfono y contraseña son requeridos' });
  }

  try {
    const sql = 'SELECT * FROM personal WHERE telefono = ?';
    db.query(sql, [telefono], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Teléfono no encontrado' });
      }

      const user = results[0];

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(contrasenia, user.contrasenia);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Respuesta exitosa
      return res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          curp: user.curp,
          nombre: user.nombre,
          apellidoPaterno: user.apellido_paterno,
          apellidoMaterno: user.apellido_materno,
          telefono: user.telefono,
          rol: user.rol,
        },
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};