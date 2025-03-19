import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js'; // Use .js extension
import staffRouter from './routes/staffRoutes.js'; // Use .js extension

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/staff', staffRouter);

export default app; // Use export default