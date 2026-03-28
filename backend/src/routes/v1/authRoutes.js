import express from 'express';
import authController from '../../controllers/authController.js';
import authMiddleware from '../../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Profile (protected)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/update-password', authMiddleware, authController.updatePassword);

// Google OAuth (disabled)
export default router;
