import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { FaTicketAlt, FaBus, FaMoneyBillWave, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router';
import axios from 'axios';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorTickets();
  }, []);

  const fetchVendorTickets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets`);
      // Filter tickets created by this vendor
      const vendorTickets = response.data.filter(ticket => ticket.vendorId === user?.uid);
      setTickets(vendorTickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  // Sample revenue data
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 }
  ];

  const stats = [
    { title: 'My Tickets', value: tickets.length, icon: <FaTicketAlt />, color: 'bg-blue-600 dark:bg-blue-700', textColor: 'text-blue-600 dark:text-blue-400' },
    { title: 'Active Routes', value: 8, icon: <FaBus />, color: 'bg-green-600 dark:bg-green-700', textColor: 'text-green-600 dark:text-green-400' },
    { title: 'Total Bookings', value: 156, icon: <FaUsers />, color: 'bg-purple-600 dark:bg-purple-700', textColor: 'text-purple-600 dark:text-purple-400' },
    { title: 'Revenue (This Month)', value: '67K', icon: <FaMoneyBillWave />, color: 'bg-orange-600 dark:bg-orange-700', textColor: 'text-orange-600 dark:text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Vendor Dashboard Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
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
                  <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">VENDOR</span>
                </div>
                <p className="text-blue-100">{user?.displayName}</p>
              </div>
            </div>

            <Link to="/add-ticket" className="btn bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2">
              <FaPlus />
              Add New Ticket
            </Link>
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

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* My Tickets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Tickets</h2>
            <Link to="/add-ticket" className="btn btn-primary text-sm flex items-center gap-2">
              <FaPlus />
              Add Ticket
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Route</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Seats</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                          {ticket.from} → {ticket.to}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge badge-primary">{ticket.transportType}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                        ৳{ticket.price}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {ticket.availableSeats}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400" title="Edit">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaTicketAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No tickets yet</p>
              <Link to="/add-ticket" className="btn btn-primary">
                Add Your First Ticket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
