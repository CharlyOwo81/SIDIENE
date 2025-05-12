import express from 'express';
import { createAcuerdo } from '../../backend/controllers/acuerdoController.js';

const router = express.Router();

router.post('/incidencias/:id_incidencia/acuerdos', createAcuerdo);

export default router;

