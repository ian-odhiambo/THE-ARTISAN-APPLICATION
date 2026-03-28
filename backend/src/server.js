import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';
import session from 'express-session';
import passport from 'passport';
import User from './models/User.js';

// Import route files 
import authRoutes from './routes/v1/authRoutes.js';
import productRoutes from './routes/v1/ProductsRoutes.js';
import adminRoutes from './routes/v1/adminRoutes.js';
import emailOtpRoutes from './routes/v1/emailOtpRoutes.js';
import orderRoutes from './routes/v1/orderRoutes.js';
import paymentRoutes from './routes/v1/paymentsRoutes.js';
import emailRoutes from './routes/v1/emailRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Generate server key on startup for JWT token invalidation
global.serverKey = crypto.randomBytes(32).toString('hex');
console.log('Server started with key:', global.serverKey);

// CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

// Session middleware (needed for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Middleware
app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('Backend is running!'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/otp', emailOtpRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/email', emailRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error!:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

