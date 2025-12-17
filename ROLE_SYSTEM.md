# Role-Based Access Control (RBAC) Implementation Guide

## Overview
The TicketBari platform now implements a complete Role-Based Access Control system with three user roles: **User**, **Vendor**, and **Admin**. Each role has specific permissions and access to dedicated dashboard features.

---

## User Roles

### 1. **User** (Default Role)
- **Purpose**: Regular customers who book tickets
- **Permissions**:
  - Search and browse all available tickets
  - Book tickets from vendors
  - View booking history
  - Manage profile settings
  - Leave reviews (future feature)
- **Dashboard Features**:
  - Total bookings statistics
  - Upcoming trips
  - Completed trips
  - Total spending tracker
  - Booking history with transport type distribution
  - Recent bookings list

### 2. **Vendor**
- **Purpose**: Transport service providers who offer tickets
- **Permissions**:
  - All User permissions
  - Add new tickets (routes, pricing, schedules)
  - Edit and delete own tickets
  - View booking requests for their tickets
  - Track revenue and sales analytics
  - Manage transport fleet
- **Dashboard Features**:
  - My tickets management
  - Active routes statistics
  - Total bookings count
  - Revenue tracking (monthly)
  - Revenue trend charts
  - Quick ticket add/edit/delete actions

### 3. **Admin**
- **Purpose**: Platform administrators with full system access
- **Permissions**:
  - All User and Vendor permissions
  - View all users and their roles
  - Manage user accounts (approve/suspend)
  - View all tickets across all vendors
  - Platform-wide analytics
  - Approve/reject vendor applications (future)
  - Manage advertised tickets
- **Dashboard Features**:
  - Total users statistics
  - Total tickets across platform
  - Active vendors count
  - Platform revenue tracking
  - Transport type distribution (Pie Chart)
  - User role distribution (Bar Chart)
  - User management table with actions

---

## Implementation Details

### 1. User Registration with Role Selection

**File**: `client/src/pages/Register.jsx`

Users can select their role during registration:
```jsx
<select name="role" value={formData.role} onChange={handleChange}>
  <option value="user">User (Book Tickets)</option>
  <option value="vendor">Vendor (Provide Transport Services)</option>
</select>
```

- Default role is **"user"**
- Vendors self-register but may require admin approval (future)
- Admin role is assigned manually via database

### 2. Role Storage and Persistence

**Client-side**: `localStorage.setItem('userRole', role)`
- Role is stored in localStorage for quick access
- Retrieved on app load via AuthProvider

**Server-side**: MongoDB User model
```javascript
{
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  }
}
```

### 3. Role-Based Dashboard Routing

**File**: `client/src/pages/Dashboard.jsx`

The Dashboard component automatically routes to the appropriate dashboard:
```jsx
const userRole = localStorage.getItem('userRole') || 'user';

if (userRole === 'admin') {
  return <AdminDashboard />;
}
if (userRole === 'vendor') {
  return <VendorDashboard />;
}
// Default User Dashboard
```

### 4. My Profile Page

**File**: `client/src/pages/MyProfile.jsx`
**Route**: `/my-profile`

Features:
- View and edit profile information
- Display user role with color-coded badge
  - Admin: Purple
  - Vendor: Blue
  - User: Green
- Role-specific permissions list
- Account status display
- Member since date

### 5. Role Badge Colors

```javascript
const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'vendor':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
  }
};
```

---

## API Integration

### Fetching User Role on Login

**File**: `client/src/providers/AuthProvider.jsx`

When a user logs in, the system fetches their role from the backend:
```javascript
const response = await fetch(`${API_URL}/users/uid/${currentUser.uid}`);
const userData = await response.json();
localStorage.setItem('userRole', userData.role || 'user');
```

### Saving User with Role

**Registration Process**:
1. User fills registration form and selects role
2. Firebase creates authentication account
3. User data (including role) is saved to MongoDB:
```javascript
POST /api/users
{
  name, email, photoURL, role, uid
}
```

---

## File Structure

```
client/src/
├── pages/
│   ├── Dashboard.jsx          # Router to role-specific dashboards
│   ├── AdminDashboard.jsx     # Admin dashboard with full analytics
│   ├── VendorDashboard.jsx    # Vendor dashboard with ticket management
│   ├── MyProfile.jsx          # User profile with role display
│   └── Register.jsx           # Registration with role selection
├── providers/
│   └── AuthProvider.jsx       # Fetches and stores user role
└── components/
    └── Navbar.jsx             # Shows "My Profile" link

server/
├── models/
│   └── User.js                # User model with role field
└── routes/
    └── users.js               # User CRUD with role support
```

---

## Testing Guide

### Test User Role
1. Register as "User" at `/register`
2. Navigate to `/dashboard` → See User Dashboard
3. Go to `/my-profile` → See "USER" role badge (green)
4. View permissions: Search/book tickets, view history, manage profile

### Test Vendor Role
1. Register as "Vendor" at `/register`
2. Navigate to `/dashboard` → See Vendor Dashboard
3. View: My Tickets, Revenue Chart, Add/Edit/Delete buttons
4. Go to `/my-profile` → See "VENDOR" role badge (blue)

### Test Admin Role
1. Manually set role to "admin" in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Login with that account
3. Navigate to `/dashboard` → See Admin Dashboard
4. View: All users, all tickets, platform analytics
5. Go to `/my-profile` → See "ADMIN" role badge (purple)

---

## Future Enhancements

### Planned Features:
1. **Vendor Application System**
   - Users request vendor status
   - Admin approves/rejects applications
   - Email notifications

2. **Permission-Based Route Guards**
   - Protect `/add-ticket` route (vendor+ only)
   - Protect admin routes (admin only)
   - Show/hide nav items based on role

3. **Role Management Interface**
   - Admin can change user roles
   - Promote users to vendors
   - Demote or suspend accounts

4. **Audit Logs**
   - Track role changes
   - Monitor admin actions
   - User activity logs

---

## Security Considerations

### Current Implementation:
- ✅ Role stored in MongoDB with validation
- ✅ Role enum prevents invalid values
- ✅ Firebase UID links authentication to role

### Recommendations:
- 🔒 Add server-side role verification middleware
- 🔒 Implement JWT with role claims
- 🔒 Add route guards based on Firebase Custom Claims
- 🔒 Validate role on every protected API call

### Example Middleware (Future):
```javascript
const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    const user = await User.findOne({ uid: req.user.uid });
    if (user.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
router.post('/tickets', verifyToken, requireRole('vendor'), createTicket);
```

---

## Troubleshooting

### Role Not Displaying
**Problem**: Profile shows "User" but I registered as "Vendor"

**Solution**:
1. Check MongoDB: `db.users.find({ email: "your@email.com" })`
2. Verify localStorage: Open DevTools → Application → Local Storage
3. Clear localStorage and re-login
4. Check browser console for fetch errors

### Dashboard Shows Wrong View
**Problem**: Seeing User dashboard but role is Vendor

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Logout and login again
3. Check that role is correctly saved in MongoDB
4. Verify AuthProvider is fetching role on login

### Cannot Access My Profile
**Problem**: `/my-profile` shows 404

**Solution**:
1. Verify route is added in `App.jsx`
2. Check that MyProfile.jsx exists
3. Ensure PrivateRoute wraps the route
4. Check for import errors in console

---

## Code Locations

| Feature | File Path | Lines |
|---------|-----------|-------|
| Role Selection UI | `client/src/pages/Register.jsx` | 254-265 |
| Role Storage | `client/src/providers/AuthProvider.jsx` | 54-71 |
| User Model | `server/models/User.js` | 15-19 |
| Dashboard Router | `client/src/pages/Dashboard.jsx` | 8-18 |
| My Profile Page | `client/src/pages/MyProfile.jsx` | 1-287 |
| Admin Dashboard | `client/src/pages/AdminDashboard.jsx` | 1-230 |
| Vendor Dashboard | `client/src/pages/VendorDashboard.jsx` | 1-200 |

---

## Support

For issues or questions about the role system:
1. Check this documentation
2. Review console errors in browser DevTools
3. Check MongoDB user collection for role field
4. Verify localStorage in Application tab
5. Test with different roles to isolate issues

**Note**: Admin role must be assigned manually via database for security. Future versions will include an admin interface for role management.
