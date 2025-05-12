import db from "../config/db.js"; // Ensure this uses connection pooling
import bcryptjs from "bcryptjs";

export const authController = async (req, res) => {
  const { telefono, contrasenia } = req.body;

  if (!telefono || !contrasenia) {
    return res
      .status(400)
      .json({ message: "Teléfono y contraseña son requeridos" });
  }

  try {
    // Modified query to include estatus check
    const sql = "SELECT * FROM personal WHERE telefono = ?";
    const [results] = await db.query(sql, [telefono]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Teléfono no encontrado" });
    }

    const user = results[0];

    // Block inactive/retired users
    if (user.estatus === "INACTIVO" || user.estatus === "JUBILADO") {
      return res.status(403).json({
        message: `Cuenta ${user.estatus.toLowerCase()}. Contacte al administrador.`,
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      contrasenia,
      user.contrasenia
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        curp: user.curp,
        nombres: user.nombres,
        apellidoPaterno: user.apellido_paterno,
        apellidoMaterno: user.apellido_materno,
        rol: user.rol.toUpperCase(),
        telefono: user.telefono,
        estatus: user.estatus, // Include status in response
      },
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
