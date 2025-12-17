import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaTicketAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaEdit, FaTrash, FaEye, FaCheckCircle, FaTimesCircle, 
  FaHourglass, FaBus, FaTrain, FaShip, FaPlane, FaPlus
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, ticketId: null });

  // Sample ticket data (would come from API)
  useEffect(() => {
    const sampleTickets = [
      {
        id: 1,
        title: 'Premium AC Coach',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        from: 'Dhaka',
        to: 'Chittagong',
        transportType: 'Bus',
        price: 800,
        quantity: 40,
        availableSeats: 25,
        departureDate: 'Dec 25, 2025',
        departureTime: '10:00 AM',
        perks: ['AC', 'WiFi', 'TV'],
        status: 'approved',
        createdAt: '2025-12-01T10:00:00Z'
      },
      {
        id: 2,
        title: 'Express Train Service',
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
        from: 'Dhaka',
        to: 'Sylhet',
        transportType: 'Train',
        price: 600,
        quantity: 60,
        availableSeats: 45,
        departureDate: 'Dec 28, 2025',
        departureTime: '08:00 AM',
        perks: ['AC', 'Food'],
        status: 'approved',
        createdAt: '2025-12-02T14:00:00Z'
      },
      {
        id: 3,
        title: 'Deluxe Cabin Launch',
        image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
        from: 'Dhaka',
        to: 'Barisal',
        transportType: 'Launch',
        price: 500,
        quantity: 30,
        availableSeats: 30,
        departureDate: 'Dec 30, 2025',
        departureTime: '11:00 PM',
        perks: ['Cabin', 'Food'],
        status: 'pending',
        createdAt: '2025-12-15T09:00:00Z'
      },
      {
        id: 4,
        title: 'Morning Flight Special',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
        from: 'Dhaka',
        to: "Cox's Bazar",
        transportType: 'Plane',
        price: 3500,
        quantity: 20,
        availableSeats: 15,
        departureDate: 'Jan 05, 2026',
        departureTime: '06:00 AM',
        perks: ['WiFi', 'Food', 'Entertainment'],
        status: 'rejected',
        rejectionReason: 'Price seems too high for this route',
        createdAt: '2025-12-10T11:00:00Z'
      },
      {
        id: 5,
        title: 'Night Express Bus',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
        from: 'Dhaka',
        to: 'Rangpur',
        transportType: 'Bus',
        price: 750,
        quantity: 35,
        availableSeats: 35,
        departureDate: 'Jan 10, 2026',
        departureTime: '09:00 PM',
        perks: ['AC', 'Sleeper', 'Blanket'],
        status: 'pending',
        createdAt: '2025-12-18T08:00:00Z'
      }
    ];

    setTimeout(() => {
      setTickets(sampleTickets);
      setLoading(false);
    }, 500);
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      Bus: <FaBus />,
      Train: <FaTrain />,
      Launch: <FaShip />,
      Plane: <FaPlane />
    };
    return icons[type] || <FaBus />;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: <FaHourglass />,
        label: 'Pending Approval'
      },
      approved: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        icon: <FaCheckCircle />,
        label: 'Approved'
      },
      rejected: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-400',
        icon: <FaTimesCircle />,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleDelete = (ticketId) => {
    setDeleteModal({ show: true, ticketId });
  };

  const confirmDelete = () => {
    setTickets(prev => prev.filter(t => t.id !== deleteModal.ticketId));
    toast.success('Ticket deleted successfully');
    setDeleteModal({ show: false, ticketId: null });
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            My Added Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your ticket listings
          </p>
        </div>
        <Link 
          to="/dashboard/add-ticket"
          className="mt-4 md:mt-0 btn btn-primary flex items-center gap-2 w-fit"
        >
          <FaPlus />
          Add New Ticket
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{tickets.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {tickets.filter(t => t.status === 'approved').length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {tickets.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 shadow-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">
            {tickets.filter(t => t.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Tickets Grid */}
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);

            return (
              <div 
                key={ticket.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Transport Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium text-gray-800 dark:text-white">
                      {getTypeIcon(ticket.transportType)}
                      {ticket.transportType}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold">
                      ৳{ticket.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {ticket.title}
                  </h3>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{ticket.from} → {ticket.to}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {ticket.departureDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {ticket.departureTime}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Available / Total</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {ticket.availableSeats} / {ticket.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sold</p>
                      <p className="font-semibold text-green-600">
                        {ticket.quantity - ticket.availableSeats}
                      </p>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ticket.perks.map((perk, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                        {perk}
                      </span>
                    ))}
                  </div>

                  {/* Rejection Reason */}
                  {ticket.status === 'rejected' && ticket.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        <strong>Reason:</strong> {ticket.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/ticket/${ticket.id}`}
                      className="flex-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <FaEye />
                      View
                    </Link>
                    <button 
                      disabled={ticket.status === 'rejected'}
                      className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                        ticket.status === 'rejected'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      }`}
                    >
                      <FaEdit />
                      Update
                    </button>
                    <button 
                      onClick={() => handleDelete(ticket.id)}
                      disabled={ticket.status === 'rejected'}
                      className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        ticket.status === 'rejected'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <FaTicketAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Tickets Added Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding your first ticket!</p>
          <Link to="/dashboard/add-ticket" className="btn btn-primary">
            <FaPlus className="inline mr-2" />
            Add Your First Ticket
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Delete Ticket?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, ticketId: null })}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
