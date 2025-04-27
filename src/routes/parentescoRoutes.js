import express from 'express';
import { getParentescos } from '../controllers/parentescoController.js';

const router = express.Router();

// Get all parentesco options
router.get('/', getParentescos);

export default router;