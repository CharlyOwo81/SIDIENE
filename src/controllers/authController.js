import db from '../config/db.js'; // Ensure this uses connection pooling
import bcryptjs from 'bcryptjs';

export const authController = async (req, res) => {
  console.log("Petición POST recibida en '/login'");
  const { telefono, contrasenia } = req.body;
  console.log("Datos recibidos:", { telefono, contrasenia });

  // Validate input
  if (!telefono || !contrasenia) {
    console.error("Validation error: Teléfono y contraseña son requeridos");
    return res.status(400).json({ message: 'Teléfono y contraseña son requeridos' });
  }

  try {
    // Define the SQL query
    const sql = 'SELECT * FROM personal WHERE telefono = ?';
    console.log("Executing SQL query:", sql, "with telefono:", telefono);

    // Log query execution time
    const startTime = Date.now();
    const [results] = await db.query(sql, [telefono]);
    const endTime = Date.now();
    console.log(`Query execution time: ${endTime - startTime}ms`);

    // Check if user exists
    if (results.length === 0) {
      console.error("No user found with the provided telefono");
      return res.status(401).json({ message: 'Teléfono no encontrado' });
    }

    // Compare passwords
    const user = results[0];
    console.log("User found:", user);

    const isPasswordValid = await bcryptjs.compare(contrasenia, user.contrasenia);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      console.error("Password comparison failed");
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Successful login
    return res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        curp: user.curp,
        nombre: user.nombres,
        apellidoPaterno: user.apellido_paterno,
        apellidoMaterno: user.apellido_materno,
        telefono: user.telefono,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};