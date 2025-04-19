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
// controllers/incidentController.js
// controllers/incidentController.js
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get current incident state and student CURP
    const [current] = await db.query(
      `SELECT estado, id_estudiante FROM incidencia WHERE id_incidencia = ?`,
      [id]
    );

    if (!current.length) {
      return res.status(404).json({ success: false, message: 'Incidencia no encontrada' });
    }

    if (current[0].estado === 'ACTUALIZADO') {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta incidencia ya fue actualizada' 
      });
    }

    // 2. Get tutors with their relationship type
    const [tutors] = await db.query(`
      SELECT 
        t.email, 
        t.telefono,
        p.tipo AS parentesco
      FROM estudiantetutor et
      JOIN tutor t ON et.curp_tutor = t.curp
      JOIN parentesco p ON t.parentesco_id = p.id
      WHERE et.curp_estudiante = ?
    `, [current[0].id_estudiante]);

    // 3. Update the incident
    const updateData = {
      fecha: new Date(req.body.fecha),
      nivel_severidad: req.body.nivel_severidad,
      motivo: req.body.motivo,
      descripcion: req.body.descripcion,
      estado: 'ACTUALIZADO'
    };

    await db.query(
      `UPDATE incidencia SET ? WHERE id_incidencia = ?`,
      [updateData, id]
    );

    // 4. Get incident counts with severity breakdown
    const [counts] = await db.query(`
      SELECT 
        COUNT(CASE WHEN nivel_severidad = 'LEVE' THEN 1 END) AS leves,
        COUNT(CASE WHEN nivel_severidad = 'SEVERO' THEN 1 END) AS severos,
        COUNT(CASE WHEN nivel_severidad = 'GRAVE' THEN 1 END) AS graves
      FROM incidencia
      WHERE id_estudiante = ?
    `, [current[0].id_estudiante]);

    const { leves, severos, graves } = counts[0];

    // 5. Notification logic with parentesco priority
    const notifications = tutors.map(async (tutor) => {
      const message = `Estimado ${tutor.parentesco},\nEl estudiante ha alcanzado:\n` +
        `${leves} incidencias leves\n` +
        `${severos} incidencias severas\n` +
        `${graves} incidencias graves`;

      // Priority: Parents first
      const isParent = tutor.parentesco.toLowerCase().includes('padre') || 
                      tutor.parentesco.toLowerCase().includes('madre');

      if ((leves >= 3 || severos >= 2 || graves >= 1) && isParent) {
        // Send immediate notification to parents
        if (tutor.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: tutor.email,
            subject: 'URGENTE: Notificación de Incidencias',
            text: message
          });
        }
        if (tutor.telefono) {
          await sendSMS(tutor.telefono, `URGENTE: ${message}`);
        }
      } else if (leves >= 3 || severos >= 2 || graves >= 1) {
        // Regular notification for other tutors
        if (tutor.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: tutor.email,
            subject: 'Notificación de Incidencias',
            text: message
          });
        }
      }
    });

    await Promise.all(notifications);

    res.json({
      success: true,
      message: 'Incidencia actualizada y notificaciones enviadas',
      data: {
        ...updateData,
        tutores_notificados: tutors.map(t => ({
          email: t.email,
          telefono: t.telefono,
          parentesco: t.parentesco
        })),
        conteo_incidencias: counts[0]
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