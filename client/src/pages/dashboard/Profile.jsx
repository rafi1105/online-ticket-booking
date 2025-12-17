import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaEdit, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const userRole = localStorage.getItem('userRole') || 'user';

  const getRoleBadge = () => {
    const badges = {
      admin: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Administrator' },
      vendor: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', label: 'Vendor' },
      user: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'User' }
    };
    return badges[userRole] || badges.user;
  };

  const roleBadge = getRoleBadge();

  const profileInfo = [
    { 
      icon: <FaUser className="text-blue-600 dark:text-blue-400" />, 
      label: 'Full Name', 
      value: user?.displayName || 'Not Set' 
    },
    { 
      icon: <FaEnvelope className="text-green-600 dark:text-green-400" />, 
      label: 'Email Address', 
      value: user?.email || 'Not Set' 
    },
    { 
      icon: <FaUserTag className="text-purple-600 dark:text-purple-400" />, 
      label: 'Account Role', 
      value: roleBadge.label,
      isBadge: true 
    },
    { 
      icon: <FaCalendarAlt className="text-orange-600 dark:text-orange-400" />, 
      label: 'Member Since', 
      value: user?.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : 'N/A'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">
          {userRole === 'vendor' ? 'Vendor' : userRole === 'admin' ? 'Admin' : 'User'} Profile
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-24 md:h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 md:h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Profile Picture */}
        <div className="relative px-4 md:px-8 pb-6 md:pb-8">
          <div className="relative -mt-12 md:-mt-20 mb-4 md:mb-6">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-700">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&size=150&background=3B82F6&color=fff`}
                alt={user?.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
              <FaCamera className="text-sm md:text-base" />
            </button>
          </div>

          {/* User Name & Role */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {user?.displayName}
            </h2>
            <span className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 ${roleBadge.bg} ${roleBadge.text} rounded-full text-sm font-semibold`}>
              <FaUserTag className="text-xs md:text-sm" />
              {roleBadge.label}
            </span>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {profileInfo.map((info, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm text-lg md:text-xl flex-shrink-0">
                  {info.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">{info.label}</p>
                  {info.isBadge ? (
                    <span className={`inline-block px-2 md:px-3 py-0.5 md:py-1 ${roleBadge.bg} ${roleBadge.text} rounded font-semibold text-xs md:text-sm`}>
                      {info.value}
                    </span>
                  ) : (
                    <p className="text-sm md:text-base font-semibold text-gray-800 dark:text-white truncate">{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button className="btn btn-primary btn-sm md:btn flex items-center justify-center gap-2">
              <FaEdit />
              Edit Profile
            </button>
            <button className="btn btn-outline btn-sm md:btn">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎫</div>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-1">
            {userRole === 'vendor' ? 'Total Tickets' : 'My Bookings'}
          </h3>
          <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">💰</div>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-1">
            {userRole === 'vendor' ? 'Total Revenue' : 'Total Spent'}
          </h3>
          <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">৳18,500</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">⭐</div>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-1">
            {userRole === 'vendor' ? 'Average Rating' : 'Rewards Points'}
          </h3>
          <p className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
            {userRole === 'vendor' ? '4.8' : '1,250'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
