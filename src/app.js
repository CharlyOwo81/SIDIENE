import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from '../src/routes/authRoutes.js';
import studentRoutes from '../src/routes/studentRoutes.js'; // Adjust the path as needed

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.all('*', (req, res) => {
  res.status(404).send('404! Page not found');
});

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5137', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`🔍 Request received: ${req.method} ${req.url}`);
  next();
});

// Define the base URL for API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Start the server
const port = process.env.PORT || 3307;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});