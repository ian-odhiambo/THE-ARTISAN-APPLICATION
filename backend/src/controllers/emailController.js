import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Order Confirmation Controller
export const sendOrderConfirmation = async (req, res) => {
  try {
    console.log('[EmailController] Send order confirmation:', req.body.orderId);
    
    const { customerEmail, customerName, items, totalAmount, orderId, paymentMethod } = req.body;

    const itemsHtml = items
      .map(item => `<li>${item.title} × ${item.quantity} — ₹${item.price * item.quantity}</li>`)
      .join('');

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: customerEmail,
      subject: '🧾 Order Confirmation - Desi-Etsy',
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #cc5200;">Thank you for your order, ${customerName}!</h2>
          <p>Your order <strong>#${orderId}</strong> has been received and is being processed.</p>
          <p><strong>Payment Method:</strong> ${paymentMethod || 'Razorpay (Online)'}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <h3 style="margin-top: 20px;">🛍️ Items Ordered:</h3>
          <ul>${itemsHtml}</ul>
          <hr />
          <p style="color: #888;">We'll notify you once your items are shipped.</p>
          <p>Regards,<br/>Desi-Etsy Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('[EmailController] Confirmation sent to:', customerEmail);
    res.status(200).json({ message: 'Order confirmation email sent.' });
  } catch (err) {
    console.error('[EmailController] Send error:', err);
    res.status(500).json({ message: 'Failed to send confirmation email' });
  }
};

export default {
  sendOrderConfirmation
};
