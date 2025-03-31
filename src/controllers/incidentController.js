import Incident from '../models/incidentModel.js';

export const createIncident = async (req, res) => {
  try {
    const requiredFields = ['id_estudiante', 'id_personal', 'nivel_severidad', 'motivo', 'descripcion'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} es requerido`
        });
      }
    }

    const incidentId = await Incident.create(req.body);
    
    // Respuesta simplificada sin necesidad de obtener el registro
    res.status(201).json({
      success: true,
      data: {
        id: incidentId,
        ...req.body // Incluimos los datos que ya tenemos
      },
      message: "Incidencia registrada exitosamente"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.getAll();
    res.status(200).json({
      success: true,
      data: incidents,
      count: incidents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};