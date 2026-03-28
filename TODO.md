# Fix Data Not Saving to MongoDB

## Steps Completed
- [x] Analyzed backend controllers/routes/models - save logic correct
- [x] Started backend dev server
- [x] Created frontend/.env with REACT_APP_API_URL
- [x] Frontend now sends requests (OTP error confirms connectivity)

## Current Issue: Failed to send OTP
Backend /otp/send-email-otp reached but nodemailer fails (likely Gmail auth)

## Next Steps
1. Restart frontend dev server (`cd frontend && npm run dev`)
2. **Fix backend/.env email config:**
   ```
   MAIL_USER=yourgmail@gmail.com
   MAIL_PASS=your 16-char app password (not account password)
   ```
   - Enable 2FA on Gmail
   - Generate App Password: Google Account > Security > App passwords > Mail > Generate
3. Restart backend dev
4. Test register:
   - Strong password (Test123!)
   - Click Register → check backend log for OTP send success
   - Enter OTP from *email* → Verify → register success
5. Check Atlas Users collection
6. Test Cart → Order POST

## Next Steps

1. Restart frontend dev server (`cd frontend && npm run dev`)
2. Test register form:
   - Fill name, email, strong password (e.g. Passw0rd!)
   - Click Register → OTP sent toast → step 2
   - Enter OTP from email → Verify → success + login redirect
3. Check backend console for:
   - MongoDB Connected
   - [AuthController] Register attempt
   - User registered
4. Check MongoDB Atlas Users collection
5. Test order place from CartPage
