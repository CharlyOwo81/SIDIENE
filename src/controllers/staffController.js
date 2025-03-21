import bcrypt from 'bcryptjs';
import db from '../config/db.js';

 const contraseñasPorRol = {
   DIRECTIVO: '26Dst0056sD',
   PREFECTO: '26Dst0056sP',
   DOCENTE: '26Dst0056sDo',
   TRABAJADOR_SOCIAL: '26Dst0056sTS',
 };

export const addStaff = async (req, res) => {
  const { curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol } = req.body;

  if (!curp || !nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const contrasenia = contraseñasPorRol[rol]; // Obtiene la contraseña base
    if (!contrasenia) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10); // Encripta la contraseña

    const sql = `
      INSERT INTO personal (curp, nombres, apellido_paterno, apellido_materno, telefono, rol, contrasenia)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [curp, nombre, apellidoPaterno, apellidoMaterno, telefono ,rol, hashedPassword];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      return res.json({ 
        message: 'Personal registrado exitosamente', 
        contrasenia: contrasenia, 
        rol: rol });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};