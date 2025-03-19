import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js'; // Use .js extension

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);

export default app; // Use export default