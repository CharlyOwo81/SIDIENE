    import express from 'express';
    import cors from 'cors';
    import authRouter from './routes/authRoutes.js'; // Use .js extension
    import staffRouter from './routes/staffRoutes.js'; // Use .js extension

    const app = express();
    // Configura CORS para permitir solicitudes desde tu frontend
    app.use(cors({
        origin: 'http://localhost:5137', // Cambia esto si tu frontend está en otro puerto o dominio
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json());

    app.use('/api/auth', authRouter);
    app.use('/api/staff', staffRouter);

    export default app; // Use export default