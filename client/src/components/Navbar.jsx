import { Link, NavLink } from 'react-router';
import { useContext, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout()
      .then(() => {
        // Successfully logged out
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-semibold transition-all'
              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/all-tickets"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold transition-all'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              All Tickets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold transition-all'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b-2 border-blue-100 dark:border-gray-700 transition-colors">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400" style={{ fontFamily: "'Borel', cursive" }}>
                TicketBari
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">Book Your Journey</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <ul className="flex items-center space-x-6 xl:space-x-8 text-sm md:text-base">{navLinks}</ul>

            {/* Theme Toggle & User Section */}
            <div className="flex items-center space-x-3 xl:space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="group relative">
                    <div className="flex items-center space-x-2 xl:space-x-3 cursor-pointer bg-gray-50 dark:bg-gray-800 px-3 xl:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <img
                        src={user.photoURL || 'https://via.placeholder.com/40'}
                        alt={user.displayName}
                        className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border-2 border-blue-500 shadow-md object-cover"
                      />
                      <div className="flex items-center gap-1 xl:gap-2">
                        <span className="text-sm xl:text-base text-gray-800 dark:text-gray-100 font-semibold max-w-[80px] xl:max-w-none truncate">
                          {user.displayName?.split(' ')[0]}
                        </span>
                        <FaChevronDown className="text-gray-500 dark:text-gray-400 text-xs group-hover:rotate-180 transition-transform" />
                      </div>
                    </div>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 dark:border-gray-700 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/my-profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                      >
                        <FaUser />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 xl:space-x-3">
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <FaBars className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-screen pb-4 md:pb-6' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col space-y-3 md:space-y-4 pt-4">{navLinks}</ul>
          <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt={user.displayName}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-800 dark:text-gray-100 font-semibold truncate">{user.displayName}</p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/my-profile"
                  className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUser />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Link
                  to="/login"
                  className="btn btn-outline w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
