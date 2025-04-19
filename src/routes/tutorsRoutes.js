// routes/tutorRoutes.js
import express from 'express';
import {
  createTutor,
  getAllTutors,
  getTutorsByStudent,
  updateTutor,
  deleteTutor,
  exportStudentTutorsPDF
} from '../controllers/tutorsController.js';

const router = express.Router();

// Create new tutor
router.post('/', createTutor);

// Get all tutors
router.get('/', getAllTutors);

// Get tutors by student CURP
router.get('/student/:curp', getTutorsByStudent);

// Update tutor
router.put('/:curp', updateTutor);

// Delete tutor
router.delete('/:curp', deleteTutor);

// Export student tutors PDF
router.get('/export/:curp', exportStudentTutorsPDF);

export default router;