import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import {loginUser} from '../controllers/authController.js';

// Inicializar el router
const router = express.Router(); 

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Exportar el router
export default router; 