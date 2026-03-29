import express from 'express';
import nodemailer from 'nodemailer';
import User from '../../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
const otpStore = new Map(); // Temporary OTP store

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Send OTP
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '🛡️ OTP Verification - Artisan-project',
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #cc5200;">Desi-Etsy OTP Verification</h2>
          <p>Hello,</p>
          <p><strong>Your OTP: <span style="color: #cc5200;">${otp}</span></strong></p>
          <p>Valid for 5 minutes. Please do not share it with anyone.</p>
          <p style="color: #888;">- Desi-Etsy Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ OTP Email Failed:', err);
        return res.status(500).json({ error: 'Failed to send OTP. Check email settings.' });
      } else {
        console.log('✅ OTP Email Sent!:', info.response);
        otpStore.set(email, otp);
        setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('❌ Server Error!:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify OTP
router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ verified: false, message: 'OTP expired or not sent' });
  }

  if (stored === otp) {
    otpStore.delete(email);
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ verified: false, message: 'Invalid OTP' });
  }
});

export default router;
