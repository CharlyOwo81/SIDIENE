import Expediente from '../models/expedienteModel.js';
import Incident from '../models/incidentModel.js';

export const createExpediente = async (req, res) => {
  try {
    const { id_estudiante } = req.body;

    if (!id_estudiante) {
      return res.status(400).json({
        success: false,
        message: 'El ID del estudiante es requerido',
      });
    }

    const existingExpediente = await Expediente.findOne({ id_estudiante });
    if (existingExpediente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un expediente para este estudiante',
      });
    }

    const incidents = await Incident.getByStudent(id_estudiante);
    if (!incidents.length) {
      return res.status(400).json({
        success: false,
        message: 'No se encontraron incidencias para este estudiante',
      });
    }

    const idExpediente = await Expediente.create({ id_estudiante });
    await Expediente.createBulkIncidencias(idExpediente, incidents);

    res.status(201).json({
      success: true,
      message: `Expediente creado con ${incidents.length} incidencias`,
      data: {
        id_expediente: idExpediente,
        id_estudiante,
        count: incidents.length,
      },
    });
  } catch (error) {
    console.error('Error creating expediente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el expediente',
      error: error.message,
    });
  }
};

export const getExpedientesByStudent = async (req, res) => {
  try {
    const { idEstudiante } = req.params;
    const rows = await Expediente.getByStudent(idEstudiante);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado o sin expediente',
      });
    }

    // Transform flat rows into nested structure
    const expedientesMap = new Map();
    rows.forEach(row => {
      const expedienteId = row.id_expediente;

      if (!expedientesMap.has(expedienteId)) {
        expedientesMap.set(expedienteId, {
          id_expediente: row.id_expediente,
          id_estudiante: row.id_estudiante,
          fecha_creacion: row.fecha_creacion,
          curp: row.curp,
          nombres: row.nombres,
          apellido_paterno: row.apellido_paterno,
          apellido_materno: row.apellido_materno,
          grado: row.grado,
          grupo: row.grupo,
          incidencias: [],
        });
      }

      const expediente = expedientesMap.get(expedienteId);

      // Find or create the incident
      let incidencia = expediente.incidencias.find(
        inc => inc.id_incidencia === row.id_incidencia
      );
      if (!incidencia && row.id_incidencia) {
        incidencia = {
          id_incidencia: row.id_incidencia,
          motivo: row.motivo,
          fecha: row.fecha,
          descripcion: row.descripcion,
          nivel_severidad: row.nivel_severidad,
          acuerdos: [],
        };
        expediente.incidencias.push(incidencia);
      }

      // Add agreement if exists
      if (row.id_acuerdo) {
        incidencia.acuerdos.push({
          id_acuerdo: row.id_acuerdo,
          descripcion: row.acuerdo_desc,
          estatus: row.estatus,
          fecha_creacion: row.acuerdo_fecha,
        });
      }
    });

    const expedientes = Array.from(expedientesMap.values());

    res.json({
      success: true,
      data: expedientes,
      count: expedientes.length,
    });
  } catch (error) {
    console.error('Error fetching expedientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener expedientes',
      error: error.message,
    });
  }
};

export const getStudentsWithExpediente = async (req, res) => {
  try {
    const { grado, grupo } = req.params;

    if (!grado || !grupo) {
      return res.status(400).json({
        success: false,
        message: 'Grado y grupo son requeridos',
      });
    }

    const students = await Expediente.getStudentsWithExpediente(grado, grupo);

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron estudiantes para el grado y grupo especificados',
      });
    }

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error('Error fetching students with expediente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estudiantes',
      error: error.message,
    });
  }
};

export const addAcuerdo = async (req, res) => {
  try {
    const { idIncidencia } = req.params;
    const { descripcion, canalizacion, estatus } = req.body;

    if (!descripcion || !estatus) {
      return res.status(400).json({
        success: false,
        message: 'La descripción y el estatus son requeridos',
      });
    }

    const acuerdoId = await Expediente.addAcuerdo(idIncidencia, {
      descripcion,
      canalizacion,
      fecha_creacion: new Date(),
      estatus: estatus || 'ABIERTO',
    });

    res.json({
      success: true,
      message: 'Acuerdo agregado a la incidencia',
      data: { id_acuerdo: acuerdoId },
    });
  } catch (error) {
    console.error('Error adding acuerdo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar el acuerdo',
      error: error.message,
    });
  }
};