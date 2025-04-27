import express from 'express';
import {
  createTutor,
  getAllTutors,
  getTutorsByStudent,
  updateTutor,
  deleteTutor,
  exportStudentTutorsPDF,
  uploadTutorsFromPdf, // Add new controller
  getTutorsStudents,
} from '../controllers/tutorsController.js';

const router = express.Router();

// Create new tutor
router.post('/', createTutor);

// Get all tutors (with search and filters)
router.get('/', getAllTutors);

// Get tutors by student CURP
router.get('/student/:curp', getTutorsByStudent);

// Update tutor
router.put('/:curp', updateTutor);

// Delete tutor
router.delete('/:curp', deleteTutor);

// Get students by tutor CURP
router.get('/:curp/students', getTutorsStudents);

// Export student tutors PDF
router.get('/export', exportStudentTutorsPDF);

// Get tutors with filters
router.get('/filtrados', getAllTutors);

// Upload tutors from PDF
router.post('/upload-pdf', uploadTutorsFromPdf);


export default router;