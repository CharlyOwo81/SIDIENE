import express from 'express';
import {
  uploadPdf,
  createStudent,
  getAllStudents,
  getStudentByCurp,
  updateStudent,
  deleteStudent
} from '../controllers/studentsController.js';
import { authenticate } from '../middleware/auth.js';
import { validateStudent } from '../middleware/validation.js';

const router = express.Router();

// PDF Upload (Protected + Admin-only)
router.post('/students/upload', authenticate, checkRole('admin'), uploadPdf);

// CRUD operations (Protected)
router.post('/students', authenticate, validateStudent, createStudent);
router.get('/students', authenticate, getAllStudents);
router.get('/students/:curp', authenticate, getStudentByCurp);
router.put('/students/:curp', authenticate, validateStudent, updateStudent);
router.delete('/students/:curp', authenticate, checkRole('admin'), deleteStudent);

export default router;