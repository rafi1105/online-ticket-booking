import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllTickets from './pages/AllTickets';
import TicketDetails from './pages/TicketDetails';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './routes/PrivateRoute';
import AuthProvider from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';

// Dashboard Pages
import Profile from './pages/dashboard/Profile';
import MyBookings from './pages/dashboard/MyBookings';
import Transactions from './pages/dashboard/Transactions';
import VendorAddTicket from './pages/dashboard/VendorAddTicket';
import MyTickets from './pages/dashboard/MyTickets';
import RequestedBookings from './pages/dashboard/RequestedBookings';
import Revenue from './pages/dashboard/Revenue';

// Admin Dashboard Pages
import ManageTickets from './pages/dashboard/admin/ManageTickets';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import AdvertiseTickets from './pages/dashboard/admin/AdvertiseTickets';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="all-tickets"
              element={
                <PrivateRoute>
                  <AllTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="ticket/:id"
              element={
                <PrivateRoute>
                  <TicketDetails />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Dashboard Layout Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* Shared Routes */}
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            
            {/* User Routes */}
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="transactions" element={<Transactions />} />
            
            {/* Vendor Routes */}
            <Route path="add-ticket" element={<VendorAddTicket />} />
            <Route path="my-tickets" element={<MyTickets />} />
            <Route path="requested-bookings" element={<RequestedBookings />} />
            <Route path="revenue" element={<Revenue />} />
            
            {/* Admin Routes */}
            <Route path="manage-tickets" element={<ManageTickets />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="advertise-tickets" element={<AdvertiseTickets />} />
          </Route>

          {/* 404 Error Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;