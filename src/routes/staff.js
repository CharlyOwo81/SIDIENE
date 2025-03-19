import express from 'express';
import { registerStaff } from '../controllers/staffController';
import db from '../config/db';

const router = express.Router();

router.post('/ManageStaff', registerStaff);

export default router;