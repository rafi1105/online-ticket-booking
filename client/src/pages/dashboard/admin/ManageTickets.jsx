import { useState, useEffect } from 'react';
import { 
  FaTicketAlt, FaCheckCircle, FaTimesCircle, FaSearch,
  FaHourglass, FaBus, FaTrain, FaShip, FaPlane, FaEye
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectModal, setRejectModal] = useState({ show: false, ticketId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [viewModal, setViewModal] = useState({ show: false, ticket: null });

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Fetch all tickets including pending ones for admin
        const response = await api.get('/tickets?status=all');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      Bus: <FaBus className="text-blue-600" />,
      Train: <FaTrain className="text-green-600" />,
      Launch: <FaShip className="text-cyan-600" />,
      Plane: <FaPlane className="text-purple-600" />
    };
    return icons[type] || <FaBus className="text-blue-600" />;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: <FaHourglass className="text-sm" />,
        label: 'Pending'
      },
      approved: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        icon: <FaCheckCircle className="text-sm" />,
        label: 'Approved'
      },
      rejected: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-400',
        icon: <FaTimesCircle className="text-sm" />,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleApprove = async (ticketId) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: 'approved' });
      setTickets(prev => prev.map(t => 
        t._id === ticketId ? { ...t, status: 'approved' } : t
      ));
      toast.success('Ticket approved! It will now be visible on the All Tickets page.');
    } catch (error) {
      console.error('Error approving ticket:', error);
      toast.error('Failed to approve ticket');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await api.put(`/tickets/${rejectModal.ticketId}`, { 
        status: 'rejected', 
        rejectionReason: rejectReason 
      });
      setTickets(prev => prev.map(t => 
        t._id === rejectModal.ticketId ? { ...t, status: 'rejected', rejectionReason: rejectReason } : t
      ));
      setRejectModal({ show: false, ticketId: null });
      setRejectReason('');
      toast.success('Ticket rejected.');
    } catch (error) {
      console.error('Error rejecting ticket:', error);
      toast.error('Failed to reject ticket');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter and search
  let filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter);
  
  if (searchTerm) {
    filteredTickets = filteredTickets.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">
          Manage Tickets
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Approve or reject vendor ticket submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`p-3 md:p-4 rounded-xl text-left transition-all ${
            filter === 'all' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-xs md:text-sm ${filter === 'all' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>All</p>
          <p className="text-xl md:text-2xl font-bold">{tickets.length}</p>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`p-3 md:p-4 rounded-xl text-left transition-all ${
            filter === 'pending' 
              ? 'bg-yellow-500 text-white shadow-lg' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-xs md:text-sm ${filter === 'pending' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-400'}`}>Pending</p>
          <p className={`text-xl md:text-2xl font-bold ${filter !== 'pending' && 'text-yellow-700 dark:text-yellow-400'}`}>
            {tickets.filter(t => t.status === 'pending').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`p-3 md:p-4 rounded-xl text-left transition-all ${
            filter === 'approved' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-xs md:text-sm ${filter === 'approved' ? 'text-green-100' : 'text-green-600 dark:text-green-400'}`}>Approved</p>
          <p className={`text-xl md:text-2xl font-bold ${filter !== 'approved' && 'text-green-700 dark:text-green-400'}`}>
            {tickets.filter(t => t.status === 'approved').length}
          </p>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`p-3 md:p-4 rounded-xl text-left transition-all ${
            filter === 'rejected' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:shadow-lg'
          }`}
        >
          <p className={`text-xs md:text-sm ${filter === 'rejected' ? 'text-red-100' : 'text-red-600 dark:text-red-400'}`}>Rejected</p>
          <p className={`text-xl md:text-2xl font-bold ${filter !== 'rejected' && 'text-red-700 dark:text-red-400'}`}>
            {tickets.filter(t => t.status === 'rejected').length}
          </p>
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ticket title, vendor, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm md:text-base text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Ticket Info
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Route
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Type
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Vendor
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
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);

                  return (
                    <tr 
                      key={ticket._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Ticket Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ticket.image}
                            alt={ticket.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {ticket.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(ticket.departureDate)} • {ticket.departureTime}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-6 py-4">
                        <p className="text-gray-800 dark:text-white">
                          {ticket.from} → {ticket.to}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1">
                          {getTypeIcon(ticket.type)}
                          <span className="text-sm text-gray-600 dark:text-gray-300">{ticket.type}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-blue-600">৳{ticket.price}</span>
                        <p className="text-xs text-gray-500">{ticket.totalSeats || ticket.availableSeats} seats</p>
                      </td>

                      {/* Vendor */}
                      <td className="px-6 py-4">
                        <p className="text-gray-800 dark:text-white text-sm">{ticket.vendorName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.vendorEmail}</p>
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewModal({ show: true, ticket })}
                            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {ticket.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(ticket._id)}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              >
                                <FaCheckCircle />
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModal({ show: true, ticketId: ticket._id })}
                                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center gap-1 transition-colors"
                              >
                                <FaTimesCircle />
                                Reject
                              </button>
                            </>
                          )}
                          {ticket.status === 'approved' && (
                            <span className="text-sm text-green-600">✓ Visible on All Tickets</span>
                          )}
                          {ticket.status === 'rejected' && (
                            <span className="text-sm text-red-600" title={ticket.rejectionReason}>✗ Rejected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FaTicketAlt className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No matching tickets found' : `No ${filter !== 'all' ? filter : ''} tickets`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTickets.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold">{filteredTickets.length}</span> of <span className="font-semibold">{tickets.length}</span> tickets
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Reject Ticket
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please provide a reason for rejecting this ticket:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setRejectModal({ show: false, ticketId: null });
                  setRejectReason('');
                }}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Reject Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModal.show && viewModal.ticket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="h-48 overflow-hidden">
              <img 
                src={viewModal.ticket.image} 
                alt={viewModal.ticket.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {viewModal.ticket.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{viewModal.ticket.from} → {viewModal.ticket.to}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transport</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{viewModal.ticket.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-semibold text-gray-800 dark:text-white">৳{viewModal.ticket.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{viewModal.ticket.totalSeats || viewModal.ticket.availableSeats} seats</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departure Date</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{formatDate(viewModal.ticket.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departure Time</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{viewModal.ticket.departureTime}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {(viewModal.ticket.features || []).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Vendor</p>
                <p className="font-semibold text-gray-800 dark:text-white">{viewModal.ticket.vendorName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{viewModal.ticket.vendorEmail}</p>
              </div>
              {viewModal.ticket.status === 'rejected' && viewModal.ticket.rejectionReason && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <strong>Rejection Reason:</strong> {viewModal.ticket.rejectionReason}
                  </p>
                </div>
              )}
              <button
                onClick={() => setViewModal({ show: false, ticket: null })}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
