import express from 'express';
import * as adminController from '../../controllers/adminController.js';

const router = express.Router();

router.get('/unapproved-artisans', adminController.getUnapprovedArtisans);

router.patch('/approve-artisan/:id', adminController.approveArtisan);

router.delete('/reject-artisan/:id', adminController.rejectArtisan);

router.get('/artisans', adminController.getAllArtisans);
router.get('/products', adminController.getAllProducts);
router.get('/stats', adminController.getAdminStats);

export default router;
