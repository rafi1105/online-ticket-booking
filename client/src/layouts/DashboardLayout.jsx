import { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import { 
  FaUser, FaTicketAlt, FaHistory, FaPlus, FaListAlt, 
  FaInbox, FaChartLine, FaBars, FaTimes, FaSignOutAlt,
  FaHome, FaChevronRight, FaUsersCog, FaStar, FaUserTie,
  FaMoon, FaSun, FaBell
} from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const userRole = localStorage.getItem('userRole') || 'user';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  // User menu items
  const userMenuItems = [
    { path: '/dashboard/profile', label: 'User Profile', icon: <FaUser /> },
    { path: '/dashboard/my-bookings', label: 'My Booked Tickets', icon: <FaTicketAlt /> },
    { path: '/dashboard/transactions', label: 'Transaction History', icon: <FaHistory /> },
  ];

  // Vendor menu items
  const vendorMenuItems = [
    { path: '/dashboard/profile', label: 'Vendor Profile', icon: <FaUser /> },
    { path: '/dashboard/add-ticket', label: 'Add Ticket', icon: <FaPlus /> },
    { path: '/dashboard/my-tickets', label: 'My Added Tickets', icon: <FaListAlt /> },
    { path: '/dashboard/requested-bookings', label: 'Requested Bookings', icon: <FaInbox /> },
    { path: '/dashboard/revenue', label: 'Revenue Overview', icon: <FaChartLine /> },
  ];

  // Admin menu items
  const adminMenuItems = [
    { path: '/dashboard/profile', label: 'Admin Profile', icon: <FaUser /> },
    { path: '/dashboard/manage-tickets', label: 'Manage Tickets', icon: <FaTicketAlt /> },
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: <FaUsersCog /> },
    { path: '/dashboard/advertise-tickets', label: 'Advertise Tickets', icon: <FaStar /> },
  ];

  // Select menu based on role
  const menuItems = userRole === 'admin' 
    ? adminMenuItems 
    : userRole === 'vendor' 
      ? vendorMenuItems 
      : userMenuItems;

  const getRoleBadge = () => {
    const badges = {
      admin: { bg: 'bg-red-500', text: 'ADMIN' },
      vendor: { bg: 'bg-purple-500', text: 'VENDOR' },
      user: { bg: 'bg-green-500', text: 'USER' }
    };
    return badges[userRole] || badges.user;
  };

  const roleBadge = getRoleBadge();

  // Sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72';
  const mainMargin = sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full ${sidebarWidth} bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 border-r border-gray-200/50 dark:border-gray-700/50`}>
        {/* Sidebar Header */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🎫
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight">Dashboard</span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 lg:p-5 border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'flex-col' : 'gap-4'}`}>
            <div className="relative">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff`}
                alt={user?.displayName}
                className={`${sidebarCollapsed ? 'w-12 h-12' : 'w-14 h-14'} rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg transition-all`}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                  {user?.displayName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <span className={`inline-block mt-1.5 px-2.5 py-0.5 ${roleBadge.bg} text-white text-xs font-bold rounded-full shadow-sm`}>
                  {roleBadge.text}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 lg:p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-18rem)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {/* Home Link */}
          <NavLink
            to="/"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group`}
          >
            <FaHome className="text-lg group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span className="font-medium">Back to Home</span>}
          </NavLink>

          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

          {/* Dashboard Menu Items */}
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span className="font-medium truncate flex-1">{item.label}</span>
                  <FaChevronRight className="text-xs opacity-50" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl mb-2 transition-colors"
          >
            <FaChevronRight className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2'} px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40`}
          >
            <FaSignOutAlt />
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${mainMargin} transition-all duration-300`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 lg:h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm flex items-center justify-between px-4 lg:px-8 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <FaBars size={20} />
            </button>
            
            {/* Breadcrumb / Page Title */}
            <div className="hidden sm:block">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user?.displayName?.split(' ')[0]}! 👋
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Here's what's happening today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <FaBell size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
              </div>
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff`}
                alt={user?.displayName}
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/50 shadow-md"
              />
            </div>
          </div>
        </header>

        {/* Page Content - Full Width */}
        <main className="p-4 lg:p-6 xl:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
