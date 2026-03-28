import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import authMiddleware from '../../middleware/auth.js';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Update Password (authenticated)
router.put('/update-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Get user from token (authMiddleware adds req.user)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Password update failed' });
  }
});

// Forgot Password (send email with reset link)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    // From your React/Vite dev server output ("On Your Network:")
    const resetLink = `http://192.168.20.1:3000/reset-password/${token}`;

    // Setup email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Desi-Etsy Password Reset',
      html: `<p>Click below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link expires in 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'Reset link sent' });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: 'Could not send reset link' });
  }
});

// Reset Password Endpoint
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset link' });
    }
    
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// Register


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JWT token with server key
    const token = jwt.sign(
      { id: user._id, role: user.role, serverKey: global.serverKey }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return both user and token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get User Profile (authenticated)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User Profile (authenticated)
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/* Google OAuth - COMMENTED OUT UNTIL SETUP

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { email, name, picture } = profile._json;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        profilePicture: picture,
        role: 'customer',
        userType: 'customer',
        isApproved: true,
        isGoogleUser: true
      });
      await user.save();
    } else {
      if (user.role !== 'customer') {
        user.role = 'customer';
        user.userType = 'customer';
        user.isApproved = true;
      }
      user.profilePicture = picture;
      user.isGoogleUser = true;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

 router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); 

 router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed` 
  }), 
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role, serverKey: global.serverKey }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`;
      res.redirect(redirectUrl);
    } catch (err) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/login?error=google_callback_error`);
    }
  }
); 
*/

export default router;