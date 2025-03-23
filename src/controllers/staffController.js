// controllers/staffController.js
import Staff from '../models/staffModel.js'; // Importa el modelo de Staff

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
    const staff = await Staff.getAll();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.getById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Miembro del staff no encontrado.' });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    await Staff.update(req.params.id, req.body);
    res.status(200).json({ message: 'Miembro del staff actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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