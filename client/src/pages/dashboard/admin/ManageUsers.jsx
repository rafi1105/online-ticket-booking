import { useState, useEffect } from 'react';
import { 
  FaUser, FaUserTie, FaUserShield, FaSearch, FaExclamationTriangle,
  FaBan, FaCheckCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fraudModal, setFraudModal] = useState({ show: false, user: null });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const usersData = response.data.map(user => ({
          id: user._id,
          odlId: user._id,
          uid: user.uid,
          name: user.name || user.displayName || 'User',
          email: user.email,
          photo: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=3B82F6&color=fff`,
          role: user.role || 'user',
          isFraud: user.isFraud || false,
          createdAt: user.createdAt
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleConfig = (role) => {
    const configs = {
      user: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400',
        icon: <FaUser />,
        label: 'User'
      },
      vendor: { 
        bg: 'bg-purple-100 dark:bg-purple-900/30', 
        text: 'text-purple-700 dark:text-purple-400',
        icon: <FaUserTie />,
        label: 'Vendor'
      },
      admin: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-400',
        icon: <FaUserShield />,
        label: 'Admin'
      }
    };
    return configs[role] || configs.user;
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await api.put(`/users/${userId}`, { role: 'admin' });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: 'admin' } : u
      ));
      toast.success('User promoted to Admin!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleMakeVendor = async (userId) => {
    try {
      await api.put(`/users/${userId}`, { role: 'vendor' });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: 'vendor' } : u
      ));
      toast.success('User promoted to Vendor!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleMarkAsFraud = async () => {
    if (fraudModal.user) {
      try {
        await api.put(`/users/${fraudModal.user.id}`, { isFraud: true });
        setUsers(prev => prev.map(u => 
          u.id === fraudModal.user.id ? { ...u, isFraud: true } : u
        ));
        toast.success(`${fraudModal.user.name} marked as fraud. All tickets hidden and future additions blocked.`);
        setFraudModal({ show: false, user: null });
      } catch (error) {
        console.error('Error marking user as fraud:', error);
        toast.error('Failed to mark user as fraud');
      }
    }
  };

  const handleUnmarkFraud = async (userId) => {
    try {
      await api.put(`/users/${userId}`, { isFraud: false });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isFraud: false } : u
      ));
      toast.success('Fraud status removed. Vendor can now add tickets again.');
    } catch (error) {
      console.error('Error removing fraud status:', error);
      toast.error('Failed to remove fraud status');
    }
  };

  // Filter and search
  let filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);
  
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Manage Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all registered users, change roles, and mark fraudulent vendors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'all' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'all' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>All Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'user' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'user' ? 'text-green-100' : 'text-green-600 dark:text-green-400'}`}>Users</p>
          <p className={`text-2xl font-bold ${filter !== 'user' && 'text-green-700 dark:text-green-400'}`}>
            {users.filter(u => u.role === 'user').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('vendor')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'vendor' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'vendor' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'}`}>Vendors</p>
          <p className={`text-2xl font-bold ${filter !== 'vendor' && 'text-purple-700 dark:text-purple-400'}`}>
            {users.filter(u => u.role === 'vendor').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'admin' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'admin' ? 'text-red-100' : 'text-red-600 dark:text-red-400'}`}>Admins</p>
          <p className={`text-2xl font-bold ${filter !== 'admin' && 'text-red-700 dark:text-red-400'}`}>
            {users.filter(u => u.role === 'admin').length}
          </p>
        </button>
        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-600 dark:text-orange-400">Fraud Vendors</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
            {users.filter(u => u.isFraud).length}
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Email
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Role
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);

                  return (
                    <tr 
                      key={user.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        user.isFraud ? 'bg-red-50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photo}
                            alt={user.name}
                            className={`w-10 h-10 rounded-full ${user.isFraud ? 'ring-2 ring-red-500' : ''}`}
                          />
                          <div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {user.name}
                            </span>
                            {user.isFraud && (
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-full">
                                <FaBan className="text-xs" />
                                FRAUD
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <span className="text-gray-600 dark:text-gray-300">
                          {user.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${roleConfig.bg} ${roleConfig.text}`}>
                          {roleConfig.icon}
                          {roleConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {/* Make Admin Button - for users and vendors */}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleMakeAdmin(user.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              title="Promote to Admin"
                            >
                              <FaUserShield className="text-xs" />
                              Make Admin
                            </button>
                          )}

                          {/* Make Vendor Button - for users only */}
                          {user.role === 'user' && (
                            <button
                              onClick={() => handleMakeVendor(user.id)}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              title="Promote to Vendor"
                            >
                              <FaUserTie className="text-xs" />
                              Make Vendor
                            </button>
                          )}

                          {/* Mark as Fraud Button - for vendors only */}
                          {user.role === 'vendor' && !user.isFraud && (
                            <button
                              onClick={() => setFraudModal({ show: true, user })}
                              className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              title="Mark as Fraudulent"
                            >
                              <FaExclamationTriangle className="text-xs" />
                              Mark as Fraud
                            </button>
                          )}

                          {/* Unmark Fraud Button - for fraud vendors */}
                          {user.role === 'vendor' && user.isFraud && (
                            <button
                              onClick={() => handleUnmarkFraud(user.id)}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              title="Remove Fraud Status"
                            >
                              <FaCheckCircle className="text-xs" />
                              Remove Fraud
                            </button>
                          )}

                          {/* Admin indicator */}
                          {user.role === 'admin' && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              System Admin
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <FaUser className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No matching users found' : 'No users found'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
            </p>
          </div>
        )}
      </div>

      {/* Mark as Fraud Confirmation Modal */}
      {fraudModal.show && fraudModal.user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-3xl text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Mark as Fraud?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{fraudModal.user.name}</p>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong>Warning:</strong> This action will:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 mt-2 space-y-1">
                <li>Hide all tickets from this vendor</li>
                <li>Prevent them from adding new tickets</li>
                <li>Flag their account as fraudulent</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFraudModal({ show: false, user: null })}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsFraud}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaBan />
                Mark as Fraud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
