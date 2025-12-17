# Admin Login Information

## Default Admin Account

**Note**: Since admin role must be assigned manually via database, you need to:

### Step 1: Register a Regular Account
1. Go to `/register`
2. Fill in the registration form with your admin credentials:
   - **Name**: Admin User (or your preferred name)
   - **Email**: admin@ticketbari.com (or your preferred email)
   - **Password**: Admin@123 (must have uppercase, lowercase, min 6 chars)
   - **Role**: Select "User" (you'll upgrade to admin manually)

### Step 2: Upgrade to Admin Role
After registration, open MongoDB and run this command:

```javascript
// MongoDB Command
db.users.updateOne(
  { email: "admin@ticketbari.com" },
  { $set: { role: "admin" } }
)
```

Or if you're using MongoDB Compass:
1. Open your `users` collection
2. Find the user with email `admin@ticketbari.com`
3. Edit the document
4. Change `role` from `"user"` to `"admin"`
5. Save the changes

### Step 3: Login with Admin Account
1. Logout if currently logged in
2. Go to `/login`
3. Enter your admin credentials:
   - **Email**: admin@ticketbari.com
   - **Password**: Admin@123
4. You'll now see the Admin Dashboard

---

## Quick Test Accounts

### For Testing Admin Features:
- **Email**: admin@ticketbari.com
- **Password**: Admin@123
- **Role**: admin (set manually in database)

### For Testing Vendor Features:
- Register with role "Vendor" selected
- **Email**: vendor@ticketbari.com
- **Password**: Vendor@123
- **Role**: vendor (automatically set during registration)

### For Testing User Features:
- Register with role "User" selected
- **Email**: user@ticketbari.com
- **Password**: User@123
- **Role**: user (automatically set during registration)

---

## Troubleshooting Registration Issues

### Firebase 400 Error - Common Causes:

1. **Email Already Exists**
   - Error: EMAIL_EXISTS
   - Solution: Use a different email or login instead

2. **Invalid Email Format**
   - Error: INVALID_EMAIL
   - Solution: Ensure email is valid (e.g., user@example.com)

3. **Weak Password**
   - Error: WEAK_PASSWORD
   - Solution: Password must be at least 6 characters

4. **Missing Firebase Configuration**
   - Check `.env.local` file has all Firebase keys
   - Restart dev server after adding env variables

5. **Firebase Project Settings**
   - Ensure Email/Password authentication is enabled in Firebase Console
   - Go to: Authentication > Sign-in method > Email/Password > Enable

---

## Firebase Configuration Checklist

Ensure your `.env.local` file contains:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_URL=http://localhost:5000/api
```

---

## Enable Email Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** in left sidebar
4. Click **Sign-in method** tab
5. Click on **Email/Password**
6. Toggle **Enable** to ON
7. Click **Save**

---

## Backend Server Requirements

Make sure your server is running:

```bash
cd server
npm install
npm start
# Server should be running on http://localhost:5000
```

---

## MongoDB Connection

Ensure MongoDB is:
- Running locally or connected to MongoDB Atlas
- Database name matches your configuration
- Users collection exists (will be auto-created on first registration)

---

## Testing the System

### Test Vendor Registration:
1. Go to `/register`
2. Select **"Vendor (Provide Transport Services)"**
3. Fill form and submit
4. After success, go to `/dashboard` → Should see Vendor Dashboard
5. Go to `/my-profile` → Should see blue "VENDOR" badge

### Test User Registration:
1. Use a different email
2. Select **"User (Book Tickets)"**
3. Fill form and submit
4. After success, go to `/dashboard` → Should see User Dashboard
5. Go to `/my-profile` → Should see green "USER" badge

---

## Debug Tips

### Check Registration Error:
Open browser Console (F12) and look for:
```javascript
// Firebase error messages
auth/email-already-in-use
auth/invalid-email
auth/weak-password
auth/operation-not-allowed
```

### Check if Server is Reachable:
Open browser Console and run:
```javascript
fetch('http://localhost:5000/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Check Firebase Connection:
In Register.jsx, the error message should show in console. Look for:
- Network errors
- CORS errors
- Firebase configuration errors

---

## Common Fix: Enable Firebase Email Auth

If you're getting 400 errors, the most common cause is Email/Password authentication not being enabled in Firebase:

**Quick Fix:**
1. Firebase Console → Your Project
2. Authentication → Sign-in method
3. Email/Password → Click to enable
4. Toggle both "Email/Password" and "Email link (passwordless sign-in)"
5. Save changes
6. Try registering again

---

## Contact & Support

If issues persist:
1. Check browser console for exact error messages
2. Verify Firebase project settings
3. Ensure server is running and MongoDB is connected
4. Check network tab for failed requests
