import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create Order Controller
export const createOrder = async (req, res) => {
  try {
    console.log('[OrderController] Create order:', req.body.userId);
    
    const { userId, items, total, address, paymentStatus } = req.body;

    const populatedItems = await Promise.all(items.map(async item => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: item.productId,
        quantity: item.quantity,
        artisan: product.artisanId 
      };
    }));

    const order = new Order({
      user: userId,
      items: populatedItems,
      total,
      address,
      paymentStatus
    });

    await order.save();
    console.log('[OrderController] Order saved:', order._id);
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error('[OrderController] Create error:', err);
    res.status(500).json({ error: err.message || 'Order failed' });
  }
};

// Get User Orders Controller
export const getUserOrders = async (req, res) => {
  try {
    console.log('[OrderController] Get orders for user:', req.params.id);
    
    const orders = await Order.find({ user: req.params.id }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error('[OrderController] Get user orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Cancel Order Controller
export const cancelOrder = async (req, res) => {
  try {
    console.log('[OrderController] Cancel order:', req.params.id);
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      return res.status(400).json({ message: 'Order cannot be cancelled anymore' });
    }

    order.status = 'Cancelled';
    await order.save();

    console.log('[OrderController] Order cancelled:', order._id);
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    console.error('[OrderController] Cancel error:', err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

// Get Artisan Orders Controller
export const getArtisanOrders = async (req, res) => {
  try {
    console.log('[OrderController] Get orders for artisan:', req.params.artisanId);
    
    const orders = await Order.find({ 'items.artisan': req.params.artisanId })
      .populate('user')
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error('[OrderController] Get artisan orders error:', err);
    res.status(500).json({ message: 'Failed to fetch artisan orders' });
  }
};

// Update Order Status Controller
export const updateOrderStatus = async (req, res) => {
  try {
    console.log('[OrderController] Update status for order:', req.params.orderId);
    
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    console.log('[OrderController] Status updated:', order._id, status);
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('[OrderController] Update status error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export default {
  createOrder,
  getUserOrders,
  cancelOrder,
  getArtisanOrders,
  updateOrderStatus
};
