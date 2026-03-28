import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

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

// Send Email OTP Controller
export const sendEmailOtp = async (req, res) => {
  try {
    console.log('[EmailOtpController] Send OTP to:', req.body.email);
    
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '🛡️ OTP Verification - Desi-Etsy',
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
        console.error('[EmailOtpController] Email failed:', err);
        return res.status(500).json({ error: 'Failed to send OTP. Check email settings.' });
      } else {
        console.log('[EmailOtpController] OTP sent:', info.response);
        otpStore.set(email, otp);
        setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('[EmailOtpController] Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Verify Email OTP Controller
export const verifyEmailOtp = (req, res) => {
  try {
    console.log('[EmailOtpController] Verify OTP for:', req.body.email);
    
    const { email, otp } = req.body;
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({ verified: false, message: 'OTP expired or not sent' });
    }

    if (stored === otp) {
      otpStore.delete(email);
      console.log('[EmailOtpController] OTP verified:', email);
      return res.status(200).json({ verified: true });
    } else {
      console.log('[EmailOtpController] Invalid OTP for:', email);
      return res.status(400).json({ verified: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('[EmailOtpController] Verify error:', err);
    res.status(500).json({ verified: false, message: 'Verification failed' });
  }
};

export default {
  sendEmailOtp,
  verifyEmailOtp
};
