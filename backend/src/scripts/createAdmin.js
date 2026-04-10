import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@theartisanproject.com';
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Admin user already exists:', existingUser.email);
      return;
    }

    const password = 'Admin@123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new User({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      isApproved: true
    });

    await admin.save();
    console.log(' Admin user created successfully!');
    console.log(' Email:', admin.email);
    console.log(' Password: Admin@123!');
    console.log(' Role: admin');
  } catch (err) {
    console.error(' Error creating admin!:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin().catch(console.error);

