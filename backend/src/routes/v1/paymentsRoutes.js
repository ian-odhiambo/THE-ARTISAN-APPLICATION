import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import Order from '../../models/Order.js';
import authMiddleware from '../../middleware/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Daraja OAuth Token Cache
let darajaToken = null;
let tokenExpiry = 0;

// Get Daraja OAuth Token (cached 55min)
const getDarajaToken = async () => {
  if (darajaToken && Date.now() < tokenExpiry) return darajaToken;

  try {
    const auth = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`).toString('base64');
    const { data } = await axios.post('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {}, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });
    
    darajaToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000 * 0.9); // 90%
    return darajaToken;
  } catch (err) {
    throw new Error(`Token fetch failed: ${err.response?.data?.errorMessage || err.message}`);
  }
};

// STK Push (Lipa Na MPESA Online)
router.post('/order', authMiddleware, async (req, res) => {
  const { amount, phoneNumber, orderItems, address } = req.body; // Frontend sends phone (2547...)

  try {
    if (!amount || !phoneNumber || !orderItems || !address) {
      return res.status(400).json({ error: 'Amount, phone, items & address required' });
    }

    const token = await getDarajaToken();

    // 1. Create M-Pesa Order in your DB (pending)
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      total: amount,
      address,
      paymentStatus: 'Pending'
    });
    await order.save();

    // 2. STK Push Request
    const timestamp = new Date().toISOString().slice(0,19).replace('T','+');
    const password = Buffer.from(`${process.env.DARAJA_BUSINESS_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString('base64');
    
    const stkData = {
      BusinessShortCode: process.env.DARAJA_BUSINESS_SHORTCODE || '174379',
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.DARAJA_BUSINESS_SHORTCODE || '174379',
      PhoneNumber: phoneNumber,
      CallBackURL: `${req.protocol}://${req.get('host')}/api/v1/payment/mpesa-callback`,
      AccountReference: `Order_${order._id}`,
      TransactionDesc: `Payment for order ${order._id}`
    };

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ M-Pesa STK Push:', data);
    res.json({
      success: true,
      checkout_request_id: data.CheckoutRequestID,
      orderId: order._id,
      message: 'Payment request sent to your phone. Enter M-Pesa PIN to complete.'
    });

  } catch (err) {
    console.error('❌ STK Push failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed', details: err.message });
  }
});

// M-Pesa Callback (XML parsing needed for production)
router.post('/mpesa-callback', express.raw({type: 'application/json'}), (req, res) => {
  console.log('M-Pesa Callback received:', req.body.toString());
  res.status(200).send('OK');
});

// Test STK (sandbox phone: 254708374149)
router.post('/test-stk', (req, res) => {
  res.json({ testPhone: '254708374149', endpoint: '/order' });
});

export default router;
