import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import AdminDashboard from './AdminDashboard';
import VendorDashboard from './VendorDashboard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { FaTicketAlt, FaClock, FaCheckCircle, FaChartLine, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const userRole = localStorage.getItem('userRole') || 'user';

  // Route to appropriate dashboard based on role
  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'vendor') {
    return <VendorDashboard />;
  }

  // Default User Dashboard below

  // Sample data for charts
  const bookingData = [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 19 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 25 },
    { month: 'May', bookings: 22 },
    { month: 'Jun', bookings: 30 }
  ];

  const transportData = [
    { name: 'Bus', value: 45, color: '#3B82F6' },
    { name: 'Train', value: 25, color: '#10B981' },
    { name: 'Launch', value: 15, color: '#06B6D4' },
    { name: 'Plane', value: 15, color: '#8B5CF6' }
  ];

  const recentBookings = [
    { id: 1, route: 'Dhaka → Chittagong', type: 'Bus', date: 'Dec 20, 2025', status: 'confirmed', amount: 800 },
    { id: 2, route: 'Dhaka → Sylhet', type: 'Train', date: 'Dec 22, 2025', status: 'pending', amount: 1200 },
    { id: 3, route: 'Dhaka → Cox\'s Bazar', type: 'Plane', date: 'Dec 25, 2025', status: 'confirmed', amount: 3500 }
  ];

  const stats = [
    { title: 'Total Bookings', value: 24, icon: <FaTicketAlt />, color: 'bg-blue-600 dark:bg-blue-700', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Upcoming Trips', value: 5, icon: <FaClock />, color: 'bg-green-600 dark:bg-green-700', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'Completed Trips', value: 19, icon: <FaCheckCircle />, color: 'bg-purple-600 dark:bg-purple-700', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Total Spent', value: '18.5K', icon: <FaChartLine />, color: 'bg-orange-600 dark:bg-orange-700', textColor: 'text-orange-600 dark:text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Full-width Dashboard Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* User Profile Section */}
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/80'}
                  alt={user?.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">USER</span>
                </div>
                <p className="text-blue-100 flex items-center gap-2">
                  <FaUser className="text-sm" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="btn bg-white text-blue-600 hover:bg-gray-100">
                🎫 Book Ticket
              </button>
              <button className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600">
                📊 View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.title}</p>
              <p className={`text-4xl font-bold ${stat.textColor} dark:opacity-90`}>
                {typeof stat.value === 'number' ? (
                  <CountUp end={stat.value} duration={2} />
                ) : (
                  `৳${stat.value}`
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Booking Trends */}
          <div className="dashboard-card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <FaChartLine className="text-blue-600 dark:text-blue-400" />
              Booking Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transport Distribution */}
          <div className="dashboard-card">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Transport Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recent Bookings</h2>
            <button className="btn btn-outline text-sm">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Route</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-200">{booking.route}</td>
                    <td className="py-4 px-4">
                      <span className="badge badge-primary">{booking.type}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{booking.date}</td>
                    <td className="py-4 px-4">
                      <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-blue-600 dark:text-blue-400">৳{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No bookings yet. Start booking your tickets!</p>
              <button className="btn btn-primary mt-6">
                Browse Tickets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
