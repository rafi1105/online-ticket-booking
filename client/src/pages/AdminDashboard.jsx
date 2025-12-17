import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { FaUsers, FaTicketAlt, FaStore, FaChartLine, FaUserShield, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, ticketsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets`)
      ]);
      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  // Calculate statistics
  const userCount = users.filter(u => u.role === 'user').length;
  const vendorCount = users.filter(u => u.role === 'vendor').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const transportData = [
    { name: 'Bus', value: tickets.filter(t => t.transportType === 'Bus').length, color: '#3B82F6' },
    { name: 'Train', value: tickets.filter(t => t.transportType === 'Train').length, color: '#10B981' },
    { name: 'Launch', value: tickets.filter(t => t.transportType === 'Launch').length, color: '#06B6D4' },
    { name: 'Plane', value: tickets.filter(t => t.transportType === 'Plane').length, color: '#8B5CF6' }
  ];

  const userRoleData = [
    { role: 'Users', count: userCount },
    { role: 'Vendors', count: vendorCount },
    { role: 'Admins', count: adminCount }
  ];

  const stats = [
    { title: 'Total Users', value: users.length, icon: <FaUsers />, color: 'bg-blue-600 dark:bg-blue-700', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Total Tickets', value: tickets.length, icon: <FaTicketAlt />, color: 'bg-green-600 dark:bg-green-700', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'Active Vendors', value: vendorCount, icon: <FaStore />, color: 'bg-purple-600 dark:bg-purple-700', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Platform Revenue', value: '2.5M', icon: <FaChartLine />, color: 'bg-orange-600 dark:bg-orange-700', textColor: 'text-orange-600 dark:text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Admin Dashboard Header */}
      <div className="bg-purple-600 dark:bg-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">
                <FaUserShield className="text-5xl text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">ADMIN</span>
                </div>
                <p className="text-purple-100">{user?.displayName}</p>
              </div>
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
          {/* Transport Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Transport Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transportData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
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

          {/* User Roles Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Roles</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">User Management</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr key={userData._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={userData.photoURL || 'https://via.placeholder.com/40'} 
                            alt={userData.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{userData.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {userData.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          userData.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : userData.role === 'vendor'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {userData.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400" title="Approve">
                            <FaCheck />
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400" title="Suspend">
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
