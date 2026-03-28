# Daraja API Integration TODO

## Plan Breakdown
- [x] Get user Daraja credentials
- [x] Install axios in backend
- [x] Update paymentsRoutes.js with Daraja STK Push (Razorpay removed)
- [ ] User adds Daraja vars to backend/.env manually (Key, Secret, Shortcode, Passkey)
- [ ] Restart backend server
- [ ] Test POST /api/v1/payment/order with sandbox phone 254708374149
- [ ] Update frontend CartPage/ProductDetailsPage for M-Pesa phone input
- [ ] Implement full callback XML parsing in /mpesa-callback
- [ ] cd backend && npm uninstall razorpay (if installed)

**Status: Backend routes ready! Add .env vars & restart.**
