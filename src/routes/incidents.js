import express from 'express';
import { searchIncidents } from '../controllers/incidentsController';
import db from '../config/db';

const router = express.Router();

router.get('/search-incidents', searchIncidents);

export default router;