import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true 
    },
    description: { 
      type: String 
    },
    price: { 
      type: Number,
      required: true 
    },
    image: {
      type: String, 
      required: true 
    },
    category: { 
      type: String
    },
    // Artisan Info
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: { 
      type: Boolean, 
      default: false 
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;