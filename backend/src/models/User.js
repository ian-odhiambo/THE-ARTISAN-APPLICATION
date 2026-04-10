import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'artisan', 'admin'],
    default: 'customer'
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  profilePicture: String,
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
