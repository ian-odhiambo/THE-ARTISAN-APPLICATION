import axios from 'axios';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

// Daraja OAuth Token Cache (shared)
let darajaToken = null;
let tokenExpiry = 0;

const getDarajaToken = async () => {
  if (darajaToken && Date.now() < tokenExpiry) return darajaToken;

  try {
    const auth = Buffer.from(`${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`).toString('base64');
    const { data } = await axios.post('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {}, {
        headers: { Authorization: `Basic ${auth}` }
      });
    
    darajaToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000 * 0.9);
    return darajaToken;
  } catch (err) {
    throw new Error(`Token fetch failed: ${err.response?.data?.errorMessage || err.message}`);
  }
};

// STK Push Controller
export const stkPush = async (req, res) => {
  try {
    console.log('[PaymentController] STK Push:', req.body.amount, req.body.phoneNumber);
    
    const { amount, phoneNumber, orderItems, address } = req.body;
    if (!amount || !phoneNumber || !orderItems || !address) {
      return res.status(400).json({ error: 'Amount, phone, items & address required' });
    }

    const token = await getDarajaToken();

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      total: amount,
      address,
      paymentStatus: 'Pending'
    });
    await order.save();

    // STK Push
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
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('[PaymentController] STK Push success:', data.CheckoutRequestID);
    res.json({
      success: true,
      checkout_request_id: data.CheckoutRequestID,
      orderId: order._id,
      message: 'Payment request sent to your phone. Enter M-Pesa PIN to complete.'
    });
  } catch (err) {
    console.error('[PaymentController] STK Push error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed', details: err.message });
  }
};

// M-Pesa Callback Controller
export const mpesaCallback = (req, res) => {
  console.log('[PaymentController] M-Pesa callback:', req.body.toString());
  res.status(200).send('OK');
};

// Test STK Controller
export const testStk = (req, res) => {
  console.log('[PaymentController] Test STK');
  res.json({ testPhone: '254708374149', endpoint: '/order' });
};

export default {
  stkPush,
  mpesaCallback,
  testStk
};
