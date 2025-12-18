import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaChartLine, FaMoneyBillWave, FaTicketAlt, FaUsers,
  FaArrowUp, FaArrowDown, FaCalendarAlt
} from 'react-icons/fa';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const Revenue = () => {
  const { user } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Sample revenue data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, bookings: 56 },
    { month: 'Feb', revenue: 52000, bookings: 64 },
    { month: 'Mar', revenue: 48000, bookings: 58 },
    { month: 'Apr', revenue: 61000, bookings: 75 },
    { month: 'May', revenue: 55000, bookings: 68 },
    { month: 'Jun', revenue: 72000, bookings: 89 },
    { month: 'Jul', revenue: 68000, bookings: 84 },
    { month: 'Aug', revenue: 79000, bookings: 96 },
    { month: 'Sep', revenue: 85000, bookings: 102 },
    { month: 'Oct', revenue: 92000, bookings: 115 },
    { month: 'Nov', revenue: 88000, bookings: 108 },
    { month: 'Dec', revenue: 105000, bookings: 128 }
  ];

  const transportTypeRevenue = [
    { name: 'Bus', value: 320000, color: '#3B82F6' },
    { name: 'Train', value: 240000, color: '#10B981' },
    { name: 'Launch', value: 150000, color: '#06B6D4' },
    { name: 'Plane', value: 140000, color: '#8B5CF6' }
  ];

  const recentTransactions = [
    { id: 1, user: 'John Doe', ticket: 'Premium AC Coach', amount: 1600, date: '2025-12-18' },
    { id: 2, user: 'Jane Smith', ticket: 'Express Train Service', amount: 2400, date: '2025-12-17' },
    { id: 3, user: 'Mike Johnson', ticket: 'Deluxe Cabin Launch', amount: 1000, date: '2025-12-16' },
    { id: 4, user: 'Sarah Wilson', ticket: 'Premium AC Coach', amount: 800, date: '2025-12-15' },
    { id: 5, user: 'Tom Brown', ticket: 'Night Express Bus', amount: 2250, date: '2025-12-14' }
  ];

  const topRoutes = [
    { route: 'Dhaka → Chittagong', bookings: 245, revenue: 196000 },
    { route: 'Dhaka → Sylhet', bookings: 189, revenue: 113400 },
    { route: 'Dhaka → Cox\'s Bazar', bookings: 156, revenue: 546000 },
    { route: 'Dhaka → Barisal', bookings: 134, revenue: 67000 },
    { route: 'Chittagong → Dhaka', bookings: 128, revenue: 102400 }
  ];

  // Stats
  const stats = {
    totalRevenue: 850000,
    thisMonth: 105000,
    lastMonth: 88000,
    totalBookings: 1043,
    totalTicketsSold: 2156,
    totalTicketsAdded: 24,
    averageOrderValue: 815
  };

  const revenueChange = ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1 lg:mb-2">
            Revenue Overview
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Track your earnings and business performance
          </p>
        </div>
        <div className="flex gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FaMoneyBillWave className="text-lg lg:text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <span className={`hidden sm:flex items-center gap-1 text-xs lg:text-sm font-semibold ${
              parseFloat(revenueChange) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(revenueChange) >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(parseFloat(revenueChange))}%
            </span>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">৳{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FaTicketAlt className="text-lg lg:text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Tickets Sold</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTicketsSold.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FaChartLine className="text-lg lg:text-2xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Tickets Added</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTicketsAdded}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FaUsers className="text-lg lg:text-2xl text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">{stats.totalBookings.toLocaleString()}</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <FaCalendarAlt className="text-lg lg:text-2xl text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">This Month</p>
          <p className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-white">৳{stats.thisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `৳${value/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transport Type Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={transportTypeRevenue}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {transportTypeRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-3 lg:mt-4">
            {transportTypeRevenue.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Routes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">Top Routes</h3>
          <div className="space-y-3 lg:space-y-4">
            {topRoutes.map((route, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-sm lg:text-base text-blue-600">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm lg:text-base text-gray-800 dark:text-white truncate">{route.route}</p>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{route.bookings} bookings</p>
                  </div>
                </div>
                <p className="font-bold text-sm lg:text-base text-green-600 flex-shrink-0">৳{route.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
          <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">Recent Transactions</h3>
          <div className="space-y-3 lg:space-y-4">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {txn.user.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm lg:text-base text-gray-800 dark:text-white truncate">{txn.user}</p>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] lg:max-w-[180px]">{txn.ticket}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm lg:text-base text-green-600">+৳{txn.amount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg mt-4 lg:mt-6">
        <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-4 lg:mb-6">Monthly Bookings</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyRevenue}>
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
            <Bar dataKey="bookings" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revenue;
