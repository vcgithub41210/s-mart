import express from 'express';
import {
  register,
  publicRegister, // Add the new public registration import
  login,
  getProfile,
  logout,
  changePassword
} from '../controllers/authController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', publicRegister); // Public signup - anyone can create account

// Protected routes (authentication required)
router.post('/admin/register', verifyToken, requireAdmin, register); // Only admin can create users with specific roles
router.get('/profile', verifyToken, getProfile);
router.post('/logout', logout);
router.patch('/change-password', verifyToken, changePassword);

export default router;
