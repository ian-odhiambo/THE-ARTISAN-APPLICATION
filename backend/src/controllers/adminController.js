import User from '../models/User.js';

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

export default {
  getUnapprovedArtisans,
  approveArtisan,
  rejectArtisan
};
