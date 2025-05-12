import express from 'express';
import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getIncidentsByFilters,
  getIncidentsByStudent,
} from '../../backend/controllers/incidentController.js';
import { addAcuerdo } from '../../backend/controllers/expedienteController.js';

const router = express.Router();

// CRUD completo para incidencias
router.post('/', createIncident);
router.get('/', getAllIncidents);
router.get('/filter', getIncidentsByFilters);
router.get('/:id', getIncidentById);
// Cambiar la ruta para seguir estructura REST
router.post('/:idIncidencia/acuerdos', addAcuerdo); // ← Ruta corregida
router.put('/:id', updateIncident);
router.delete('/:id', deleteIncident);
router.get('/student/:idEstudiante', getIncidentsByStudent);

// Ruta para acuerdos
router.post('/acuerdos/:idIncidencia', addAcuerdo);

export default router;