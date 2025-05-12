    import express from 'express';
    import db from '../../backend/config/db.js';
    import bcrypt from 'bcryptjs'; // Asegúrate de que esté instalado
    import { authController } from '../../backend/controllers/authController.js';

    // Inicializar el router
    const router = express.Router();

    console.log("🚀 authController.js ha sido cargado correctamente");
    // Ruta para iniciar sesión
    router.post('/authController', authController);

    // Exportar el router
    export default router;