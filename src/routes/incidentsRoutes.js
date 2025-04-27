import express from 'express';
import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getIncidentsByFilters,
} from '../controllers/incidentController.js';

const router = express.Router();


// CRUD completo
router.post('/', createIncident);
router.get('/', getAllIncidents);
router.get('/filter', getIncidentsByFilters); // Esta debe ir ANTES de /:id
router.get('/:id', getIncidentById);
router.put('/:id', updateIncident);
router.delete('/:id', deleteIncident);


export default router;