import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentsController.js';

const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

// src/routes/studentRoutes.js
router.post('/', (req, res, next) => {
  console.log('POST /api/staff called with body:', req.body);
  next();
}, createStudent);

export default router;