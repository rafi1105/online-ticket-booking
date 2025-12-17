import { useContext, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaUserTag, FaCalendar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    });
    setIsEditing(false);
  };

  // Get user role from localStorage or default to 'user'
  const userRole = localStorage.getItem('userRole') || 'user';

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'vendor':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="section-heading">My Profile</h1>
          <p className="section-subheading">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-blue-600 dark:bg-blue-700"></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt={user?.displayName}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
                />
                <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full ${getRoleBadgeColor(userRole)} flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800`}>
                  <FaUserTag className="text-sm" />
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              </div>
            )}

            {/* Profile Form */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    className="btn btn-success flex items-center gap-2"
                  >
                    <FaSave />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* User Info Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {user?.displayName || 'Not set'}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaEnvelope className="text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-all">
                      {user?.email}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUserTag className="text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Role</span>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getRoleBadgeColor(userRole)}`}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </div>

                  {/* Account Created */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCalendar className="text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Member Since</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                        Account Status
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your account is active and verified
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </div>
                  </div>
                </div>

                {/* Role Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Role Permissions
                  </h3>
                  {userRole === 'admin' && (
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Manage all users and vendors
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Approve/reject tickets
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> View platform analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Manage advertised tickets
                      </li>
                    </ul>
                  )}
                  {userRole === 'vendor' && (
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Add and manage tickets
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> View booking requests
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Track revenue
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Manage transport fleet
                      </li>
                    </ul>
                  )}
                  {userRole === 'user' && (
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Search and book tickets
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> View booking history
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Manage profile
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> Leave reviews
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
            <span>ℹ️</span> Need to change your role?
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {userRole === 'user' 
              ? "To become a vendor and add tickets, please contact support or use the 'Become a Vendor' option in settings."
              : "Your current role provides access to specialized features. Contact admin for role modifications."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
