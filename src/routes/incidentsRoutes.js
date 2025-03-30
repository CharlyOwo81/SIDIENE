import express from 'express';
import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
} from '../controllers/incidentController.js';

const router = express.Router();

// Create incident
router.post('/', createIncident);

// Get all incidents
router.get('/', getAllIncidents);

// Get single incident
router.get('/:curp', getIncidentById);

// Update incident
router.put('/:curp', updateIncident);

// Delete incident
router.delete('/:id', deleteIncident);

export default router;