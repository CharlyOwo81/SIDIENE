import express from 'express';
import { addStaff } from '../controllers/staffController.js';
import db from '../config/db.js';

const router = express.Router();

router.post('/addStaff', addStaff);

export default router;