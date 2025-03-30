// controllers/staffController.js
import Staff from '../models/staffModel.js'; // Importa el modelo de Staff
import db from '../config/db.js';

export const createStaff = async (req, res) => {
  try {
    const { curp, nombre, apellidoPaterno, apellidoMaterno, telefono, rol } = req.body;

    // Validar que el rol sea uno de los permitidos
    const validRoles = ['DIRECTIVO', 'PREFECTO', 'DOCENTE', 'TRABAJADOR SOCIAL'];
    if (!validRoles.includes(rol)) {
      return res.status(400).json({ error: `Invalid rol value: ${rol}. Allowed values are DIRECTIVO, PREFECTO, DOCENTE, TRABAJADOR SOCIAL.` });
    }

    // Insertar el miembro del staff en la base de datos
    const staffId = await Staff.create(req.body);
    res.status(201).json({ id: staffId, message: 'Miembro del staff creado de manera exitosa.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery?.trim() || '';
    const filters = {
      rol: req.query.rol ? req.query.rol.split(',') : []
    };

    // Validate and format response
    const rawStaff = await Staff.getAll(searchQuery, filters);
    
    const formattedStaff = rawStaff.map(member => ({
      curp: member.curp,
      nombres: member.nombres,
      apellidoPaterno: member.apellidoPaterno,
      apellidoMaterno: member.apellidoMaterno,
      rol: member.rol,
      telefono: member.telefono,
      estatus: member.estatus
    }));

    res.status(200).json({
      success: true,
      data: formattedStaff,
      count: formattedStaff.length
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Database query failed'
    });
  }
};
export const getStaffById = async (req, res) => {
  try {
    const { curp } = req.params;
    
    // Validar que el ID no esté vacío
    if (!curp || curp.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "El ID no puede estar vacío."
      });
    }

    const staff = await Staff.getById(curp);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Miembro del personal no encontrado."
      });
    }

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error al obtener el miembro del personal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// In your updateStaff controller
// controllers/staffController.js
export const updateStaff = async (req, res) => {
  try {
    const { curp } = req.params; // Original CURP from URL
    const { nombres, apellidoPaterno, apellidoMaterno, rol } = req.body;

    // Validate required fields
    if (!nombres || !apellidoPaterno || !apellidoMaterno || !rol) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos"
      });
    }

    // Update staff member
    const updatedStaff = await Staff.update(curp, {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      rol
    });

    res.status(200).json({
      success: true,
      message: "Personal actualizado exitosamente",
      data: updatedStaff
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el personal"
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    await Staff.delete(req.params.id);
    res.status(200).json({ message: 'Miembro del staff eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};