import express from "express";
import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

// Create Order
router.post("/", authMiddleware, async (req, res) => {
  const { items, total, address, paymentStatus } = req.body;
  const userId = req.user.id;
  console.log("🛒 Order incoming:", {
    userId,
    items,
    total,
    address,
    paymentStatus,
  });

  try {
    // Bypass validation for testing - DB has bad _id
    console.log('Product IDs:', items.map(i => i.productId));

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (!product.artisanId) throw new Error(`Product ${item.productId} has no artisan`);
        return {
          productId: item.productId,
          quantity: item.quantity,
          artisan: product.artisanId,
        };
      }),
    );

    const order = new Order({
      user: userId,
      items: populatedItems,
      total,
      address,
      paymentStatus,
    });

    await order.save();
    console.log("✅ Order saved:", order);
    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("❌ Order Save Error:", err);
    res.status(500).json({ error: err.message || "Order failed" });
  }
});

// Get orders for a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate(
      "items.productId",
    );
    res.json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Cancel order (if not already cancelled or delivered)
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Cancelled" || order.status === "Delivered") {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled anymore" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

// Get orders for a specific artisan
router.get("/artisan/:artisanId", async (req, res) => {
  try {
    const orders = await Order.find({ "items.artisan": req.params.artisanId })
      .populate("user")
      .populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error("Fetch artisan orders error:", err);
    res.status(500).json({ message: "Failed to fetch artisan orders" });
  }
});

// Update order status (artisan action)
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;