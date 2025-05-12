import Incident from '../models/incidentModel.js';
import db from '../config/db.js';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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



export const getIncidentsByFilters = async (req, res) => {
  try {
    const filters = {
      fecha: req.query.fecha,
      nombre: req.query.nombre,
      // Asegurar matching de mayúsculas/minúsculas
      severidad: req.query.severidad?.toUpperCase() 
    };

    const incidents = await Incident.getByFilters(filters);
    
    res.status(200).json({
      success: true,
      data: incidents.map(incident => ({
        ...incident,
        contactos_tutores: incident.contactos_tutores 
          ? incident.contactos_tutores.split(',').map(c => {
              const [telefono, email] = c.split('|');
              return { telefono, email };
            })
          : []
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Controlador principal
// controllers/incidentController.js
// controllers/incidentController.js
// controllers/incidentController.js
// En controllers/incidentController.js
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar datos de entrada
    if (!req.body.nivel_severidad || !req.body.motivo) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: nivel_severidad y motivo"
      });
    }

    // Verificar si la incidencia existe
    const [current] = await db.query(
      `SELECT * FROM incidencia WHERE id_incidencia = ?`,
      [id]
    );

    if (!current.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Incidencia no encontrada' 
      });
    }

    // Validar estado
    if (current[0].estado === 'ACTUALIZADO') {
      return res.status(400).json({ 
        success: false, 
        message: 'Incidencia ya actualizada' 
      });
    }

    // Actualizar registro
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

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Incidencia actualizada correctamente',
      data: updateData
    });

  } catch (error) {
    console.error('Error en updateIncident:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
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

export const createAgreement = async (req, res) => {
  try {
    const { descripcion, estatus, fecha_creacion, id_incidencia } = req.body;
    const [result] = await db.query(
      'INSERT INTO acuerdo (descripcion, estatus, fecha_creacion, id_incidencia) VALUES (?, ?, ?, ?)',
      [descripcion, estatus, fecha_creacion, id_incidencia]
    );
    res.json({ success: true, data: { id_acuerdo: result.insertId } });
  } catch (error) {
    console.error('Error in createAgreement:', error);
    res.status(500).json({ success: false, message: 'Error al crear acuerdo' });
  }
};

export const getIncidentsByStudent = async (req, res) => {
  try {
    const { idEstudiante } = req.params;
    console.log('Fetching incidencias for idEstudiante:', idEstudiante);

    const [student] = await db.query('SELECT * FROM estudiante WHERE curp = ?', [idEstudiante]);
    console.log('Student found:', student);

    if (!student.length) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado',
      });
    }

    const [incidencias] = await db.query(
      'SELECT id_incidencia, motivo, descripcion, estado AS estatus, fecha, nivel_severidad FROM incidencia WHERE id_estudiante = ?',
      [idEstudiante]
    );
    console.log('Incidencias result:', incidencias);

    const incidenciasWithAcuerdos = await Promise.all(
      incidencias.map(async (incidencia) => {
        const [acuerdos] = await db.query(
          'SELECT id_acuerdo, descripcion, estatus, fecha_creacion FROM acuerdo WHERE id_incidencia = ?',
          [incidencia.id_incidencia]
        );
        return { ...incidencia, acuerdos };
      })
    );

    res.json({
      success: true,
      data: incidenciasWithAcuerdos,
    });
  } catch (error) {
    console.error('Error en getIncidentsByStudent:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};