import express from 'express';
import {
  createTutor,
  getAllTutors,
  getTutorsByStudent,
  updateTutor,
  deleteTutor,
  exportStudentTutorsPDF,
  uploadTutorsFromPdf // Add new controller
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

// Export student tutors PDF
router.get('/export/:curp', exportStudentTutorsPDF);

// Upload tutors from PDF
router.post('/upload-pdf', uploadTutorsFromPdf);

export default router;