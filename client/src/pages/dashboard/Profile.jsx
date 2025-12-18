import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaEdit, FaCamera,
  FaTicketAlt, FaMoneyBillWave, FaStar, FaChartLine, FaShieldAlt,
  FaCog, FaBell, FaLock, FaCheckCircle
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const userRole = localStorage.getItem('userRole') || 'user';
  const [activeTab, setActiveTab] = useState('overview');

  // Sample activity data for charts
  const activityData = [
    { month: 'Jan', bookings: 4, spent: 3200 },
    { month: 'Feb', bookings: 6, spent: 4800 },
    { month: 'Mar', bookings: 3, spent: 2400 },
    { month: 'Apr', bookings: 8, spent: 6400 },
    { month: 'May', bookings: 5, spent: 4000 },
    { month: 'Jun', bookings: 7, spent: 5600 },
  ];

  const bookingsByType = [
    { name: 'Bus', value: 45, color: '#3B82F6' },
    { name: 'Train', value: 30, color: '#10B981' },
    { name: 'Launch', value: 15, color: '#06B6D4' },
    { name: 'Plane', value: 10, color: '#8B5CF6' },
  ];

  const getRoleBadge = () => {
    const badges = {
      admin: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-white', label: 'Administrator', icon: <FaShieldAlt /> },
      vendor: { bg: 'bg-gradient-to-r from-purple-500 to-purple-600', text: 'text-white', label: 'Vendor', icon: <FaUserTag /> },
      user: { bg: 'bg-gradient-to-r from-green-500 to-green-600', text: 'text-white', label: 'User', icon: <FaUser /> }
    };
    return badges[userRole] || badges.user;
  };

  const roleBadge = getRoleBadge();

  // Stats based on role
  const stats = userRole === 'vendor' ? [
    { icon: <FaTicketAlt />, label: 'Total Tickets', value: '24', change: '+3', color: 'blue' },
    { icon: <FaMoneyBillWave />, label: 'Total Revenue', value: '৳185,000', change: '+12%', color: 'green' },
    { icon: <FaChartLine />, label: 'Bookings', value: '1,043', change: '+8%', color: 'purple' },
    { icon: <FaStar />, label: 'Rating', value: '4.8', change: '+0.2', color: 'yellow' },
  ] : userRole === 'admin' ? [
    { icon: <FaUser />, label: 'Total Users', value: '2,456', change: '+128', color: 'blue' },
    { icon: <FaTicketAlt />, label: 'Total Tickets', value: '847', change: '+45', color: 'green' },
    { icon: <FaMoneyBillWave />, label: 'Platform Revenue', value: '৳2.4M', change: '+15%', color: 'purple' },
    { icon: <FaCheckCircle />, label: 'Verified', value: '98%', change: '+2%', color: 'cyan' },
  ] : [
    { icon: <FaTicketAlt />, label: 'My Bookings', value: '24', change: '+2', color: 'blue' },
    { icon: <FaMoneyBillWave />, label: 'Total Spent', value: '৳18,500', change: '', color: 'green' },
    { icon: <FaStar />, label: 'Rewards', value: '1,250', change: '+150', color: 'purple' },
    { icon: <FaCheckCircle />, label: 'Completed', value: '22', change: '', color: 'cyan' },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    yellow: 'from-yellow-500 to-orange-500 shadow-yellow-500/30',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Image with Gradient */}
        <div className="h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          {/* Edit Cover Button */}
          <button className="absolute top-4 right-4 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <FaCamera className="text-xs" />
            <span className="hidden sm:inline">Change Cover</span>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 sm:-mt-20 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-700 transform hover:scale-105 transition-transform">
                  <img
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&size=150&background=3B82F6&color=fff`}
                    alt={user?.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110">
                  <FaCamera className="text-sm" />
                </button>
              </div>
              
              <div className="mt-2 sm:mt-0 sm:mb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    {user?.displayName}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${roleBadge.bg} ${roleBadge.text} rounded-lg text-xs font-bold shadow-lg`}>
                    {roleBadge.icon}
                    {roleBadge.label}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FaEnvelope className="text-sm" />
                  {user?.email}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-xs" />
                  Member since {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="btn btn-primary btn-sm">
                <FaEdit />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button className="btn btn-outline btn-sm">
                <FaCog />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all group">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r ${colorClasses[stat.color]} flex items-center justify-center text-white text-xl lg:text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              {stat.change && (
                <span className="text-xs lg:text-sm font-semibold text-green-500">
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Only for users and vendors */}
      {userRole !== 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              {userRole === 'vendor' ? 'Revenue Trend' : 'Activity Overview'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={userRole === 'vendor' ? 'spent' : 'bookings'} 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Bookings by Type
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bookingsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {bookingsByType.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions / Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <FaBell className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <FaLock className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Security</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Password & 2FA</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <FaCog className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Preferences</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
