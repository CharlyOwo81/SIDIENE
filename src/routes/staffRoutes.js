import express from 'express';
import {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff
} from '../controllers/staffController.js';

const router = express.Router();

router.post('/', createStaff);
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

// src/routes/studentRoutes.js
router.post('/', (req, res, next) => {
  console.log('POST /api/staff called with body:', req.body);
  next();
}, createStaff);

export default router;