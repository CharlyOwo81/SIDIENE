import Incident from '../models/incidentModel.js';

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error.message
  });
};

export const createIncident = async (req, res) => {
  try {
    const requiredFields = ['id_estudiante', 'id_personal', 'nivel_severidad', 'motivo'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    const incidentData = {
      ...req.body,
      fecha: new Date(req.body.fecha || Date.now())
    };

    const incidentId = await Incident.create(incidentData);
    
    const newIncident = await Incident.getById(incidentId);
    res.status(201).json({
      success: true,
      data: newIncident
    });

  } catch (error) {
    handleError(res, error);
  }
};

// En controllers/incidentController.js
// controllers/incidentController.js
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.getAll();
    res.status(200).json({
      success: true,
      data: incidents,
      count: incidents.length
    });
  } catch (error) {
    console.error('Error en getAllIncidents:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error // Para debug en desarrollo
    });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.getById(req.params.id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }
    res.json({ success: true, data: incident });
  } catch (error) {
    handleError(res, error);
  }
};

// Controlador principal
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      fecha: new Date(req.body.fecha),
      nivel_severidad: req.body.nivel_severidad,
      motivo: req.body.motivo,
      descripcion: req.body.descripcion
    };

    const updated = await Incident.update(id, updatedData);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    const updatedIncident = await Incident.getById(id);
    res.json({ 
      success: true, 
      data: updatedIncident 
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Funciones helper (pueden ir en el mismo archivo o en un utils/)
const getNextBusinessDay = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  
  while (result.getDay() === 0 || result.getDay() === 6) {
    result.setDate(result.getDate() + 1);
  }
  
  return result;
};

async function sendParentNotification(student, incidents) {
  const schoolName = "Escuela Primaria Revolución";
  const nextBusinessDay = getNextBusinessDay(new Date());
  
  const message = `Estimados padres de ${student.nombre}, 
    deben presentarse en ${schoolName} antes de 
    ${nextBusinessDay.toLocaleDateString()} debido a 
    incidencias acumuladas.`;

  // Implementar lógica de envío real aquí
  console.log('Enviando notificación a:', student.parentEmail);
  console.log('Mensaje:', message);
  
  // Ejemplo de envío con nodemailer (requiere configuración)
  /*
  await transporter.sendMail({
    from: 'escuela@example.com',
    to: student.parentEmail,
    subject: 'Notificación de incidencias',
    text: message
  });
  */
};

export const deleteIncident = async (req, res) => {
  try {
    const deleted = await Incident.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }
    res.json({ success: true, message: 'Incidencia eliminada' });
  } catch (error) {
    handleError(res, error);
  }
};