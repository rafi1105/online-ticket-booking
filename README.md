# TicketBari - Online Ticket Booking Platform

A comprehensive online ticket booking platform built with the MERN stack where users can discover and book travel tickets for Bus, Train, Launch, and Plane.

## 🔗 Live URL
[Coming Soon - Will be deployed on Vercel/Netlify]

## 🎯 Project Purpose
TicketBari is designed to simplify the process of booking travel tickets by providing a unified platform for multiple transportation modes. Users can easily search, compare, and book tickets while vendors can manage their offerings efficiently.

##  Key Features

### For Users
- **Advanced Search & Filter**: 
  - Search tickets by From/To location
  - Filter by transport type (Bus/Train/Launch/Plane)
  - Sort by price (Low to High / High to Low)
  - Real-time results with pagination (6 items per page)
- **Secure Authentication**: Login with email/password or Google authentication via Firebase
- **Real-time Countdown**: See departure countdown timer on ticket details
- **Interactive Booking**: Book tickets with seat selection and instant confirmation
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop devices
- **Real Images**: All tickets displayed with real high-quality images from Unsplash

### For Vendors
- **Ticket Management**: Create, update, and delete ticket listings
- **Booking Tracking**: Monitor all bookings for their services
- **Revenue Dashboard**: Track earnings and booking statistics with interactive charts

### For Admins
- **User Management**: View and manage all users and vendors
- **Platform Oversight**: Monitor all tickets and bookings across the platform
- **Analytics**: Access comprehensive platform statistics with data visualizations

### Role-Based Access Control 🎭
- **Three User Roles**: User, Vendor, and Admin with distinct permissions
- **Role Selection**: Choose role during registration (User/Vendor)
- **Dynamic Dashboards**: Role-specific dashboards with unique features and analytics
- **My Profile Page**: View and edit profile with role display and permissions
- **Permission System**: UI elements adapt based on user role

### Challenge Requirements Implemented ✅
1. ✅ **Search Functionality**: Search by From/To location with real-time filtering
2. ✅ **Sort by Price**: Sort tickets by price (Low to High / High to Low)
3. ✅ **Firebase Token Protection**: All protected API routes use Firebase authentication tokens
4. ✅ **Pagination**: Implemented pagination with 6 items per page
5. ✅ **Dark/Light Mode**: Full dark mode support with smooth theme transitions

## 🛠️ Technologies & NPM Packages Used

### Frontend (Client)
- **React 19.2.0** - UI library for building user interfaces
- **React Router DOM 7.10.1** - Client-side routing
- **Firebase 12.7.0** - Authentication and configuration
- **Tailwind CSS 4.1.18** - Utility-first CSS framework with dark mode support
- **Vite 7.2.4** - Fast build tool and development server
- **Axios 1.13.2** - HTTP client for API requests with token interceptors
- **React Hot Toast 2.6.0** - Toast notifications for user feedback
- **React Icons 5.5.0** - Icon library for UI components
- **Recharts 6.5.3** - Chart library for data visualization
- **React CountUp 6.5.3** - Animated number counting for statistics

### Backend (Server)
- **Express 5.2.1** - Web application framework for Node.js
- **Mongoose 9.0.1** - MongoDB object modeling
- **Firebase Admin SDK** - Server-side Firebase authentication verification
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
- **dotenv 17.2.3** - Environment variable management
- **Nodemon 3.1.11** (dev) - Auto-restart server during development

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-ticket-booking
   ```

2. **Setup Client**
   ```bash
   cd client
   npm install
   ```

   Create `.env.local` file in the client directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Setup Server**
   ```bash
   cd ../server
   npm install
   ```

   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend Client**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

## 📁 Project Structure

```
online-ticket-booking/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, Footer)
│   │   ├── layouts/       # Layout components (MainLayout)
│   │   ├── pages/         # Page components (Home, Login, etc.)
│   │   ├── providers/     # Context providers (AuthProvider)
│   │   ├── routes/        # Route components (PrivateRoute)
│   │   ├── firebase/      # Firebase configuration
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── models/            # Mongoose models (User, Ticket, Booking)
    ├── routes/            # Express routes
    ├── index.js           # Server entry point
    └── package.json
```

## 🔐 Environment Variables

### Client (.env.local)
- Firebase configuration keys (secured)

### Server (.env)
- MongoDB connection string (secured)
- Server port configuration

## 🎨 Design Highlights
- Modern and clean UI with proper color contrast
- Consistent layout across all pages
- Sticky navbar for easy navigation
- Comprehensive footer with contact information
- Responsive grid layouts for ticket listings
- Smooth transitions and hover effects

## 👥 User Roles
1. **User**: Can browse and book tickets
2. **Vendor**: Can create and manage ticket listings
3. **Admin**: Can manage the entire platform

## 📝 API Endpoints

### Tickets
- GET `/api/tickets` - Get all tickets
- GET `/api/tickets/:id` - Get single ticket
- POST `/api/tickets` - Create ticket (vendor)
- PUT `/api/tickets/:id` - Update ticket
- DELETE `/api/tickets/:id` - Delete ticket

### Bookings
- GET `/api/bookings` - Get all bookings
- GET `/api/bookings/user/:userId` - Get user bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Cancel booking

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- GET `/api/users/uid/:uid` - Get user by Firebase UID
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## 🔒 Security Features
- Firebase authentication
- Environment variables for sensitive data
- Protected routes for authenticated users
- Input validation and error handling

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Hamburger menu for mobile navigation
- Flexible grid layouts

## 🚀 Deployment
- Frontend: Vercel/Netlify
- Backend: Heroku/Railway/Render
- Database: MongoDB Atlas

## 📄 License
This project is licensed under the ISC License.

## 👨‍�💻 Author
Developed as part of the MERN stack selection process.

## 🙏 Acknowledgments
- Firebase for authentication services
- MongoDB for database services
- React and Express communities for excellent documentation

---

**Note**: Make sure to add your domain to Firebase authorized domains when deploying to production.
