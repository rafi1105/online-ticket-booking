import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import { 
  FaUser, FaTicketAlt, FaHistory, FaPlus, FaListAlt, 
  FaInbox, FaChartLine, FaBars, FaTimes, FaSignOutAlt,
  FaHome, FaChevronRight, FaUsersCog, FaStar, FaUserTie
} from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'user';

  const handleLogout = () => {
    logOut();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 md:w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
              🎫
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Dashboard</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff`}
              alt={user?.displayName}
              className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-blue-600"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white truncate">
                {user?.displayName}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 ${roleBadge.bg} text-white text-xs font-semibold rounded`}>
                {roleBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {/* Home Link */}
          <NavLink
            to="/"
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaHome />
            <span>Back to Home</span>
          </NavLink>

          <div className="border-t border-gray-200 dark:border-gray-700 my-3 md:my-4"></div>

          {/* Dashboard Menu Items */}
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="text-base md:text-lg">{item.icon}</span>
              <span className="font-medium truncate">{item.label}</span>
              <FaChevronRight className="ml-auto text-xs md:text-sm opacity-50 flex-shrink-0" />
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm md:text-base font-medium transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="h-14 md:h-20 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2"
          >
            <FaBars size={20} />
          </button>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <span className="hidden sm:inline text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Welcome, <span className="font-semibold text-gray-800 dark:text-white">{user?.displayName}</span>
            </span>
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff`}
              alt={user?.displayName}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-blue-600"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
