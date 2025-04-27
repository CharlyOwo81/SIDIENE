import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentByCurp,
  updateStudent,
  deleteStudent,
  uploadPdf,
  getStudentsByGradeGroup,
} from '../controllers/studentsController.js';

const router = express.Router();

router.post('/upload-pdf', uploadPdf);
router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/by-grade-group', getStudentsByGradeGroup);
router.get('/:curp', getStudentByCurp); // Get a student by CURP
router.put('/:curp', updateStudent); // Update a student by CURP
router.delete('/:id', deleteStudent);



export default router;