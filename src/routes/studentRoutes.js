import express from 'express';
import { registerStudentController } from '../controllers/studentsController.js'; // Add .js extension
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Register student route
router.post('/register', upload.single('file'), registerStudentController);

export default router;