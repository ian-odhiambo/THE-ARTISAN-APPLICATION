# Admin Dashboard Access Enabled

Admin user created successfully!

**Credentials:**
- Email: `admin@theartisanproject.com`
- Password: `Admin@123!`

## Steps Completed
- [x] 1. Created TODO.md
- [x] 2. Created backend/src/scripts/createAdmin.js
- [x] 3. Executed script to insert admin into DB (hashed password)

## To Test:
1. `cd backend && npm run dev` (start server)
2. `cd frontend && npm run dev` (start frontend)
3. Go to http://localhost:3000/login
4. Login with admin credentials → redirects to Admin Dashboard

## Production Notes:
- Change password after first login (/update-password)
- Admin cannot register via UI (blocked for security)
- Delete `backend/src/scripts/createAdmin.js` before committing or add to .gitignore

**Task Complete!** 🎉
