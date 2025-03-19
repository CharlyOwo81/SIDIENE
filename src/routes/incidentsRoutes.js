import express from 'express';
import { searchIncidents } from '../controllers/incidentsController';
import db from '../config/db.js';

const router = express.Router();

router.get('/searchIncidents', searchIncidents);
router.get('/uploadIncidents', uploadIncidents);

export default router;