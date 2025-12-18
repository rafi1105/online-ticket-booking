import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaTicketAlt, FaCheckCircle, FaTimesCircle, FaEnvelope,
  FaHourglass, FaInbox, FaSearch
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const RequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch booking requests from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/bookings/vendor/${user.uid}`);
        const bookingsData = response.data.map(booking => ({
          id: booking._id,
          ticketId: booking.ticketId?._id || booking.ticketId,
          ticketTitle: booking.ticketTitle || `${booking.from} to ${booking.to}`,
          quantity: booking.numberOfSeats,
          unitPrice: booking.pricePerSeat,
          totalPrice: booking.totalPrice,
          status: booking.status,
          userName: booking.userName || 'Customer',
          userEmail: booking.userEmail,
          userPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.userName || 'User')}&background=3B82F6&color=fff`,
          bookedAt: booking.bookedAt || booking.createdAt,
          rejectionReason: booking.rejectionReason
        }));
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load booking requests');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: <FaHourglass className="text-sm" />,
        label: 'Pending'
      },
      accepted: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        icon: <FaCheckCircle className="text-sm" />,
        label: 'Accepted'
      },
      rejected: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-400',
        icon: <FaTimesCircle className="text-sm" />,
        label: 'Rejected'
      },
      paid: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400',
        icon: <FaCheckCircle className="text-sm" />,
        label: 'Paid'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleAccept = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: 'accepted' });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'accepted' } : b
      ));
      toast.success('Booking accepted! User can now proceed with payment.');
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}`, { 
        status: 'rejected', 
        rejectionReason: 'Booking rejected by vendor' 
      });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'rejected', rejectionReason: 'Booking rejected by vendor' } : b
      ));
      toast.success('Booking rejected.');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

  // Filter and search
  let filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);
  
  if (searchTerm) {
    filteredBookings = filteredBookings.filter(b => 
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase())
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
          Requested Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage booking requests from customers
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
          <p className={`text-sm ${filter === 'all' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>All</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'pending' 
              ? 'bg-yellow-500 text-white shadow-lg' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'pending' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-400'}`}>Pending</p>
          <p className={`text-2xl font-bold ${filter !== 'pending' && 'text-yellow-700 dark:text-yellow-400'}`}>
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'accepted' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'accepted' ? 'text-green-100' : 'text-green-600 dark:text-green-400'}`}>Accepted</p>
          <p className={`text-2xl font-bold ${filter !== 'accepted' && 'text-green-700 dark:text-green-400'}`}>
            {bookings.filter(b => b.status === 'accepted').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'paid' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'paid' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'}`}>Paid</p>
          <p className={`text-2xl font-bold ${filter !== 'paid' && 'text-blue-700 dark:text-blue-400'}`}>
            {bookings.filter(b => b.status === 'paid').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`p-4 rounded-xl text-left transition-all ${
            filter === 'rejected' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-sm ${filter === 'rejected' ? 'text-red-100' : 'text-red-600 dark:text-red-400'}`}>Rejected</p>
          <p className={`text-2xl font-bold ${filter !== 'rejected' && 'text-red-700 dark:text-red-400'}`}>
            {bookings.filter(b => b.status === 'rejected').length}
          </p>
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user name, email, or ticket title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  User Name/Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Ticket Title
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Booking Quantity
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Total Price
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);

                  return (
                    <tr 
                      key={booking.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* User Name/Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.userPhoto}
                            alt={booking.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {booking.userName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FaEnvelope className="text-xs" />
                              {booking.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Ticket Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaTicketAlt className="text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-800 dark:text-white max-w-xs truncate">
                            {booking.ticketTitle}
                          </span>
                        </div>
                      </td>

                      {/* Booking Quantity */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-bold">
                          {booking.quantity}
                        </span>
                      </td>

                      {/* Total Price (Unit Price × Quantity) */}
                      <td className="px-6 py-4 text-right">
                        <p className="text-lg font-bold text-green-600">
                          ৳{booking.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.quantity} × ৳{booking.unitPrice}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {booking.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                            >
                              <FaCheckCircle />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                            >
                              <FaTimesCircle />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            {booking.status === 'accepted' && (
                              <span className="text-sm text-green-600 dark:text-green-400">
                                ✓ Awaiting payment
                              </span>
                            )}
                            {booking.status === 'paid' && (
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                ✓ Payment complete
                              </span>
                            )}
                            {booking.status === 'rejected' && (
                              <span className="text-sm text-red-600 dark:text-red-400">
                                ✗ Rejected
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaInbox className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm 
                        ? 'No matching bookings found'
                        : filter !== 'all' 
                          ? `No ${filter} bookings` 
                          : 'No booking requests yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Showing <span className="font-semibold">{filteredBookings.length}</span> of <span className="font-semibold">{bookings.length}</span> bookings
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Revenue (from filtered): <span className="font-bold text-green-600">৳{filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedBookings;
