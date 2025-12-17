# Quick Start Guide

## Fix Registration Error & Setup Admin

### 🔴 CRITICAL: Enable Firebase Email Authentication

The 400 error means Email/Password authentication is **NOT enabled** in your Firebase project.

**Fix this first:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **online-ticket-bookings**
3. Click **Authentication** (left sidebar)
4. Click **Sign-in method** tab
5. Find **Email/Password** provider
6. Click the pencil icon to edit
7. Toggle **Enable** switch to ON
8. Click **Save**

**Without this step, ALL registrations will fail!**

---

## Start the Application

### Terminal 1 - Start MongoDB (if using local)
```bash
# Windows
mongod

# Or if using MongoDB Atlas, skip this step
```

### Terminal 2 - Start Backend Server
```bash
cd server
npm install
npm start
# Should show: Server running on port 5000
```

### Terminal 3 - Start Frontend
```bash
cd client
npm install
npm run dev
# Should open: http://localhost:5173
```

---

## Test Vendor Registration

1. **Go to**: http://localhost:5173/register
2. **Fill the form**:
   - Name: `Test Vendor`
   - Email: `vendor@test.com`
   - Photo URL: `https://via.placeholder.com/150`
   - Password: `Vendor@123`
   - Confirm Password: `Vendor@123`
   - **Role**: Select **"Vendor (Provide Transport Services)"** ✅
3. **Click Register**
4. **Success**: You'll see "Registration successful as vendor!"
5. **Verify**: Go to `/my-profile` and see blue "VENDOR" badge

---

## Create Admin Account

### Step 1: Register as User First
```
Name: Admin User
Email: admin@ticketbari.com
Password: Admin@123
Role: User (Book Tickets)
```

### Step 2: Upgrade to Admin in MongoDB

**Using MongoDB Compass:**
1. Connect to your database
2. Find database: `ticket-booking` (or your database name)
3. Open `users` collection
4. Find user with email: `admin@ticketbari.com`
5. Click the pencil icon to edit
6. Change `"role": "user"` to `"role": "admin"`
7. Click Update

**Using MongoDB Shell:**
```javascript
use ticket-booking  // your database name

db.users.updateOne(
  { email: "admin@ticketbari.com" },
  { $set: { role: "admin" } }
)
```

**Using Node.js (if you have a script):**
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('your-mongodb-connection-string');

User.updateOne(
  { email: "admin@ticketbari.com" },
  { $set: { role: "admin" } }
).then(() => {
  console.log('Admin role updated');
  process.exit(0);
});
```

### Step 3: Login as Admin
1. Logout from current session
2. Go to `/login`
3. Enter:
   - Email: `admin@ticketbari.com`
   - Password: `Admin@123`
4. After login, go to `/dashboard`
5. You should see **Admin Dashboard** with purple header

---

## Verify Everything is Working

### ✅ Check Backend Server
Open: http://localhost:5000/api/users

Should see JSON array of users (might be empty initially)

### ✅ Check MongoDB Connection
Server terminal should show:
```
MongoDB connected successfully
Server running on port 5000
```

### ✅ Check Frontend
Open: http://localhost:5173

Should see homepage without errors

### ✅ Check Firebase
Browser console should NOT show:
- CORS errors
- Firebase configuration errors
- 400 errors after enabling Email auth

---

## Troubleshooting

### "400 Bad Request" Error
- ✅ **Enable Email/Password** in Firebase Console (most common)
- Check password meets requirements (6+ chars, uppercase, lowercase)
- Try a different email (might already exist)
- Check browser console for exact error code

### "Server not reachable" Error
```bash
# Check if server is running
cd server
npm start

# Check port 5000 is free
netstat -ano | findstr :5000
```

### "MongoDB connection failed"
```bash
# Check if MongoDB is running
mongosh

# Or check your MongoDB Atlas connection string
```

### Backend server won't start
```bash
cd server
rm -rf node_modules
npm install
npm start
```

### Frontend won't start
```bash
cd client
rm -rf node_modules
npm install
npm run dev
```

---

## Test All Three Roles

### Test as User:
```
Email: user@test.com
Password: User@123
Role: User (during registration)
Dashboard: Green "USER" badge
```

### Test as Vendor:
```
Email: vendor@test.com
Password: Vendor@123
Role: Vendor (during registration)
Dashboard: Blue "VENDOR" badge
```

### Test as Admin:
```
Email: admin@ticketbari.com
Password: Admin@123
Role: Admin (set manually in database)
Dashboard: Purple "ADMIN" badge
```

---

## Quick Commands Reference

```bash
# Start MongoDB (local)
mongod

# Start Backend
cd server && npm start

# Start Frontend
cd client && npm run dev

# Check MongoDB
mongosh
show dbs
use ticket-booking
db.users.find()

# Update user to admin
db.users.updateOne(
  { email: "admin@ticketbari.com" },
  { $set: { role: "admin" } }
)
```

---

## Firebase Console Direct Link

🔗 **Enable Email Auth**: https://console.firebase.google.com/project/online-ticket-bookings/authentication/providers

After clicking:
1. Find "Email/Password"
2. Click pencil icon
3. Toggle Enable
4. Save
5. Try registering again

---

## Next Steps After Setup

1. ✅ Register as Vendor
2. ✅ Add some tickets (as vendor)
3. ✅ Create admin account
4. ✅ Test booking flow (as user)
5. ✅ Test dark mode toggle
6. ✅ Test search and filters

---

## Support

If you still have issues:
1. Check browser console (F12) for errors
2. Check server terminal for errors
3. Verify MongoDB is connected
4. Ensure Firebase Email auth is enabled
5. Try clearing localStorage and cookies
