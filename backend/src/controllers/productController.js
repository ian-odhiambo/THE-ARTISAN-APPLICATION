import Product from '../models/Product.js';
import User from '../models/User.js';

 // Create Product Controller
export const createProduct = async (req, res) => {
  try {
    console.log('[ProductController] Create product:', req.body.title);
    
    const { title, description, price, image, category, artisanId } = req.body;

    const artisan = await User.findById(artisanId);
    if (!artisan) return res.status(404).json({ message: 'Artisan not found' });

    // this i have bypassed for the check
    /*
    if (artisan.role === 'artisan' && !artisan.isApproved) {
      return res.status(403).json({ message: 'Your artisan profile is not approved yet.' });
    }
    */

    const product = new Product({ title, description, price, image, category, artisanId });
    await product.save();
    
    console.log('[ProductController] Product created:', product._id);
    res.status(201).json(product);
  } catch (err) {
    console.error('[ProductController] Create error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Products Controller
export const getAllProducts = async (req, res) => {
  try {
    console.log('[ProductController] Get all approved products');
    
const products = await Product.find({ isApproved: true }).sort({createdAt: -1}).populate('artisanId', 'name');
    res.status(200).json(products);
  } catch (err) {
    console.error('[ProductController] Get all error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Products by Artisan
export const getProductsByArtisan = async (req, res) => {
  try {
    console.log('[ProductController] Get products for artisan:', req.params.artisanId);
    
    const products = await Product.find({ artisanId: req.params.artisanId });
    res.status(200).json(products);
  } catch (err) {
    console.error('[ProductController] Get by artisan error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Unapproved Products (Admin)
export const getUnapprovedProducts = async (req, res) => {
  try {
    console.log('[ProductController] Get unapproved products');
    
    const products = await Product.find({ isApproved: false }).populate('artisanId', 'name email');
    res.status(200).json(products);
  } catch (err) {
    console.error('[ProductController] Get unapproved error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Approve Product (Admin)
export const approveProduct = async (req, res) => {
  try {
    console.log('[ProductController] Approve product:', req.params.id);
    
    const { isApproved } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    res.status(200).json(product);
  } catch (err) {
    console.error('[ProductController] Approve error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    console.log('[ProductController] Update product:', req.params.id);
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(product);
  } catch (err) {
    console.error('[ProductController] Update error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    console.log('[ProductController] Delete product:', req.params.id);
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('[ProductController] Delete error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    console.log('[ProductController] Get product:', req.params.id);
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error('[ProductController] Get single error:', err);
    res.status(500).json({ error: err.message });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductsByArtisan,
  getUnapprovedProducts,
  approveProduct,
  updateProduct,
  deleteProduct,
  getProduct
};

