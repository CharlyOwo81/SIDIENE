import Incident from '../models/incidentModel.js';

export const createIncident = async (req, res) => {
  try {
    const requiredFields = ['id_estudiante', 'id_personal', 'nivel_severidad', 'descripcion'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} es requerido`
        });
      }
    }

    const incidentId = await Incident.create(req.body);
    const newIncident = await Incident.getById(incidentId);
    
    res.status(201).json({
      success: true,
      data: newIncident,
      message: "Incidencia registrada exitosamente" // Agregar mensaje
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


