import User from '../models/User.js';
import Product from '../models/Product.js';

// Get Unapproved Artisans Controller
export const getUnapprovedArtisans = async (req, res) => {
  try {
    console.log('[AdminController] Get unapproved artisans');
    
    const artisans = await User.find({ role: 'artisan', isApproved: false });
    res.status(200).json(artisans);
  } catch (err) {
    console.error('[AdminController] Get unapproved artisans error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Approve Artisan Controller
export const approveArtisan = async (req, res) => {
  try {
    console.log('[AdminController] Approve artisan:', req.params.id);
    
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    console.log('[AdminController] Artisan approved:', updated._id);
    res.status(200).json(updated);
  } catch (err) {
    console.error('[AdminController] Approve artisan error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Reject Artisan Controller
export const rejectArtisan = async (req, res) => {
  try {
    console.log('[AdminController] Reject artisan:', req.params.id);
    
    await User.findByIdAndDelete(req.params.id);
    console.log('[AdminController] Artisan rejected and deleted');
    res.status(200).json({ message: 'Artisan rejected and removed' });
  } catch (err) {
    console.error('[AdminController] Reject artisan error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Artisans (approved + pending)
export const getAllArtisans = async (req, res) => {
  try {
    console.log('[AdminController] Get all artisans');
    const artisans = await User.find({ role: 'artisan' }).sort({ createdAt: -1 }).select('-password');
    res.status(200).json(artisans);
  } catch (err) {
    console.error('[AdminController] Get all artisans error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Products (all statuses)
export const getAllProducts = async (req, res) => {
  try {
    console.log('[AdminController] Get all products');
    const products = await Product.find({}).populate('artisanId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error('[AdminController] Get all products error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get Admin Stats
export const getAdminStats = async (req, res) => {
  try {
    console.log('[AdminController] Get admin stats');
    const totalArtisans = await User.countDocuments({ role: 'artisan' });
    const unapprovedArtisans = await User.countDocuments({ role: 'artisan', isApproved: false });
    const approvedArtisans = totalArtisans - unapprovedArtisans;
    
    const totalProducts = await Product.countDocuments({});
    const approvedProducts = await Product.countDocuments({ isApproved: true });
    const unapprovedProducts = totalProducts - approvedProducts;
    
    res.status(200).json({
      artisans: { total: totalArtisans, approved: approvedArtisans, pending: unapprovedArtisans },
      products: { total: totalProducts, approved: approvedProducts, pending: unapprovedProducts }
    });
  } catch (err) {
    console.error('[AdminController] Get stats error:', err);
    res.status(500).json({ error: err.message });
  }
};

export default {
  getUnapprovedArtisans,
  approveArtisan,
  rejectArtisan,
  getAllArtisans,
  getAllProducts,
  getAdminStats
};
