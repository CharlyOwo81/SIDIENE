import Incident from '../models/incidentModel.js';
import db from '../config/db.js';

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error.message
  });
};

// controllers/incidentController.js
export const createIncident = async (req, res) => {
  try {
    // 1. Required fields validation
    const requiredFields = ['id_estudiante', 'id_personal', 'nivel_severidad', 'motivo', 'descripcion'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
        missingFields,
      });
    }

    // 4. Date validation
    const incidentDate = new Date(req.body.fecha || Date.now());
    const currentDate = new Date();
    
    if (incidentDate > currentDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha no puede ser futura',
        receivedDate: incidentDate.toISOString(),
        serverDate: currentDate.toISOString()
      });
    }

    // 5. Student existence validation
    const [student] = await db.query(
      'SELECT curp FROM estudiante WHERE curp = ?',
      [req.body.id_estudiante]
    );
    
    if (!student.length) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado',
        receivedCURP: req.body.id_estudiante
      });
    }

    // 6. Staff existence validation
    const [staff] = await db.query(
      'SELECT curp FROM personal WHERE curp = ?',
      [req.body.id_personal]
    );
    
    if (!staff.length) {
      return res.status(404).json({
        success: false,
        message: 'Personal no encontrado',
        receivedCURP: req.body.id_personal
      });
    }

    // 7. Create incident
    const incidentData = {
      ...req.body,
      fecha: incidentDate
    };

    const incidentId = await Incident.create(incidentData);
    const newIncident = await Incident.getById(incidentId);

    // 8. Success response
    return res.status(201).json({
      success: true,
      message: 'Incidencia registrada exitosamente',
      data: newIncident,
      nextSteps: [
        'Notificación enviada al tutor si aplica',
        'Registro en el historial del estudiante'
      ]
    });

  } catch (error) {
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Incidencia duplicada',
        details: 'Ya existe una incidencia idéntica para este estudiante'
      });
    }

    // Handle other errors
    console.error('Error creating incident:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
// controllers/incidentController.js
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      fecha: new Date(req.body.fecha),
      nivel_severidad: req.body.nivel_severidad,
      motivo: req.body.motivo,
      descripcion: req.body.descripcion,
      estado: 'ACTUALIZADO' // Directly set the state
    };

    // Check if incident can be updated
    const [current] = await db.query(
      `SELECT estado FROM incidencia WHERE id_incidencia = ?`,
      [id]
    );

    
    if (current[0].estado === 'ACTUALIZADO') {
      return res.status(400).json({
        success: false,
        message: 'Esta incidencia ya fue actualizada'
      });
    }

    // Get student and tutor information
    const [incidentData] = await db.query(`
      SELECT 
        i.*,
        t.email,
        t.parentesco_id
      FROM incidencia i
      JOIN estudiantetutor et ON i.id_estudiante = et.curp_estudiante
      JOIN tutor t ON et.curp_tutor = t.curp
      WHERE i.id_incidencia = ?
    `, [id]);

    if (!incidentData.length) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    const { email, parentesco_id, id_estudiante } = incidentData[0];

    // Update the incident
    const [result] = await db.query(
      `UPDATE incidencia SET ? WHERE id_incidencia = ?`,
      [updatedData, id] // Now includes estado in the update
    );

    // Get incident counts
    const [counts] = await db.query(`
      SELECT 
        SUM(nivel_severidad = 'LEVE') AS leves,
        SUM(nivel_severidad = 'SEVERO') AS severos,
        SUM(nivel_severidad = 'GRAVE') AS graves
      FROM incidencia
      WHERE id_estudiante = ?
    `, [id_estudiante]);

    const { leves, severos, graves } = counts[0];

    // Send notification if thresholds are met
    if (leves >= 1 || severos >= 2 || graves >= 3) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Notificación de Incidencias',
        html: `
          <h3>Estimado Tutor</h3>
          <p>El estudiante ha alcanzado los siguientes umbrales de incidencias:</p>
          <ul>
            ${leves >= 1 ? `<li>Incidencias leves: ${leves}</li>` : ''}
            ${severos >= 2 ? `<li>Incidencias severas: ${severos}</li>` : ''}
            ${graves >= 3 ? `<li>Incidencias graves: ${graves}</li>` : ''}
          </ul>
          <p>Por favor contacte a la institución educativa.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: 'Incidencia actualizada y notificación enviada',
      data: {
        ...updatedData,
        estado: 'ACTUALIZADO'
      }
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