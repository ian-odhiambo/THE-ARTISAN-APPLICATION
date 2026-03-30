import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

dotenv.config();

async function seedData() {
